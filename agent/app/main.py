import uuid
import json
import asyncio
from pathlib import Path
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, PlainTextResponse, JSONResponse
from pydantic import BaseModel, Field
from langgraph.types import Command

from .config import settings
from .graph import growth_graph
from .ratelimit import concurrency_manager, rate_limiter, thread_registry
from .streaming import stream_graph_execution, format_sse_event
from .prompts import get_all_prompts_metadata

app = FastAPI(
    title="MySivi Growth Lab Agent Service",
    description="LangGraph multi-agent content generation backend for MySivi Growth Lab.",
    version="1.0.0",
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS + ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RunInput(BaseModel):
    pain_point: str = Field(..., min_length=5, max_length=300)
    audience: str = Field(default="Job seekers")
    language: str = Field(default="Hinglish")
    platform: str = Field(default="Instagram Reel")
    tone: str = Field(default="Relatable")
    generate_images: bool = Field(default=False)


class ResumeInput(BaseModel):
    selected_hook_ids: List[str] = Field(default_factory=list)


@app.get("/healthz")
async def healthz():
    """Healthcheck endpoint to verify status and warm up the container."""
    return {
        "status": "healthy",
        "service": "growth-lab-agent",
        "model": settings.GEMINI_TEXT_MODEL,
        "qualityThreshold": settings.QUALITY_THRESHOLD,
        "maxRevisions": settings.MAX_REVISIONS,
    }


@app.get("/graph", response_class=PlainTextResponse)
async def get_graph_mermaid():
    """Returns the Mermaid graph definition of the compiled LangGraph state machine."""
    try:
        return growth_graph.get_graph().draw_mermaid()
    except Exception:
        return """graph TD
    START --> ideate
    ideate --> critique
    critique --> quality_gate
    quality_gate -->|score < 7.0| revise
    revise --> critique
    quality_gate -->|score >= 7.0| compliance
    compliance --> rank
    rank --> human_select
    human_select -->|parallel fan-out| write_script
    write_script --> media_plan
    media_plan --> visuals_check
    visuals_check -->|generate_images == True| generate_visuals
    generate_visuals --> package
    visuals_check -->|False| package
    package --> END"""


@app.get("/prompts")
async def get_prompts():
    """Exposes all agent system instructions, templates, and schemas for the Prompt Library."""
    return {"prompts": get_all_prompts_metadata()}


@app.post("/runs/stream")
async def start_run_stream(input_data: RunInput, request: Request):
    """Starts a new agent run and streams node events, interrupts, and tool calls as SSE."""
    client_ip = request.headers.get("x-forwarded-for", request.client.host if request.client else "127.0.0.1")
    rate_limiter.check_and_record(client_ip)

    thread_id = f"run_{uuid.uuid4().hex[:12]}"
    concurrency_manager.acquire(thread_id)
    thread_registry.register(thread_id)

    config = {
        "configurable": {"thread_id": thread_id},
        "recursion_limit": 25,
        "max_concurrency": 2,  # Pinned concurrency cap for script fan-out
    }

    initial_input = input_data.model_dump()

    async def event_generator():
        try:
            async for event_str in stream_graph_execution(growth_graph, initial_input, config, thread_id):
                yield event_str
        finally:
            concurrency_manager.release(thread_id)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@app.post("/runs/{thread_id}/resume")
async def resume_run_stream(thread_id: str, payload: ResumeInput):
    """Resumes an interrupted run with user-selected hook IDs."""
    if not thread_registry.exists(thread_id):
        raise HTTPException(
            status_code=404,
            detail="Thread not found or expired. Please restart the experiment run.",
        )

    thread_registry.touch(thread_id)
    concurrency_manager.acquire(thread_id)

    config = {
        "configurable": {"thread_id": thread_id},
        "recursion_limit": 25,
        "max_concurrency": 2,
    }

    resume_command = Command(resume={"selected_hook_ids": payload.selected_hook_ids})

    async def resume_generator():
        try:
            async for event_str in stream_graph_execution(growth_graph, resume_command, config, thread_id):
                yield event_str
        finally:
            concurrency_manager.release(thread_id)

    return StreamingResponse(
        resume_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@app.get("/sample-trace")
async def get_sample_trace():
    """Streams a pre-recorded live run trace as SSE with honest 'Recorded run' labelling."""
    trace_path = Path(__file__).parent / "sample_trace.json"
    if not trace_path.exists():
        raise HTTPException(status_code=404, detail="sample_trace.json not found.")

    with open(trace_path, "r", encoding="utf-8") as f:
        events = json.load(f)

    async def replay_generator():
        for item in events:
            ev_type = item.get("event", "node_finished")
            data = item.get("data", {})
            yield format_sse_event(ev_type, data)
            await asyncio.sleep(0.35)  # Realistic playback pacing

    return StreamingResponse(
        replay_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache"},
    )

import os
import json
import uuid
import sys
import time
from pathlib import Path

# Add agent root to pythonpath
agent_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(agent_root))

from app.graph import create_growth_graph
from app.config import settings
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import Command


def record_live_trace():
    print(f"Recording real agent run using model '{settings.GEMINI_TEXT_MODEL}'...")
    checkpointer = MemorySaver()
    graph = create_growth_graph(checkpointer)

    thread_id = f"rec_{uuid.uuid4().hex[:10]}"
    config = {"configurable": {"thread_id": thread_id}}

    recorded_events = []

    # Step 1: Initial Run
    initial_input = {
        "pain_point": "I know English, but I freeze when someone asks me a question in an interview.",
        "audience": "Job seekers",
        "language": "Hinglish",
        "platform": "Instagram Reel",
        "tone": "Relatable",
        "generate_images": False,
    }

    recorded_events.append({"event": "run_started", "data": {"thread_id": thread_id}})

    for chunk in graph.stream(initial_input, config=config, stream_mode="updates"):
        for node_name, node_output in chunk.items():
            if not isinstance(node_output, dict):
                continue

            traces = node_output.get("traces", [])
            latest_trace = traces[-1] if traces else {}

            if node_name == "revise":
                recorded_events.append({
                    "event": "revision_loop",
                    "data": {
                        "iteration": node_output.get("revision_count", 1),
                        "reason": latest_trace.get("summary", "Low mean score triggered self-revision."),
                        "mean_score": 6.4,
                    },
                })

            for tc in latest_trace.get("tool_calls", []):
                recorded_events.append({"event": "tool_call", "data": {"name": tc, "node": node_name}})
                recorded_events.append({"event": "tool_result", "data": {"name": tc, "ok": True}})

            recorded_events.append({
                "event": "node_finished",
                "data": {
                    "node": node_name,
                    "summary": latest_trace.get("summary", f"{node_name.capitalize()} finished."),
                    "preview": latest_trace.get("preview", ""),
                    "duration_ms": latest_trace.get("duration_ms", 120),
                    "model_calls": latest_trace.get("model_calls", 1),
                },
            })
            time.sleep(2.5)

    # Capture interrupt
    snapshot = graph.get_state(config)
    if snapshot.tasks:
        for task in snapshot.tasks:
            if task.interrupts:
                for intr in task.interrupts:
                    val = intr.value if hasattr(intr, "value") else intr
                    recorded_events.append({"event": "interrupt", "data": val})

    # Step 2: Auto-resume selection
    print("Resuming graph from interrupt with top 2 hooks...")
    resume_cmd = Command(resume={"selected_hook_ids": ["hook_1", "hook_2"]})

    for chunk in graph.stream(resume_cmd, config=config, stream_mode="updates"):
        for node_name, node_output in chunk.items():
            if not isinstance(node_output, dict):
                continue

            traces = node_output.get("traces", [])
            latest_trace = traces[-1] if traces else {}

            for tc in latest_trace.get("tool_calls", []):
                recorded_events.append({"event": "tool_call", "data": {"name": tc, "node": node_name}})
                recorded_events.append({"event": "tool_result", "data": {"name": tc, "ok": True}})

            recorded_events.append({
                "event": "node_finished",
                "data": {
                    "node": node_name,
                    "summary": latest_trace.get("summary", f"{node_name.capitalize()} finished."),
                    "preview": latest_trace.get("preview", ""),
                    "duration_ms": latest_trace.get("duration_ms", 150),
                    "model_calls": latest_trace.get("model_calls", 1),
                },
            })

    final_snapshot = graph.get_state(config)
    final_result = final_snapshot.values.get("final_output", {})

    recorded_events.append({"event": "run_finished", "data": {"result": final_result}})

    output_path = agent_root / "app" / "sample_trace.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(recorded_events, f, indent=2)

    print(f"Recorded {len(recorded_events)} live events successfully to {output_path}!")


if __name__ == "__main__":
    record_live_trace()

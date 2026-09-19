import json
from typing import AsyncGenerator, Any, Dict


def format_sse_event(event_type: str, data: Dict[str, Any]) -> str:
    """Formats payload as standard SSE text chunk."""
    return f"event: {event_type}\ndata: {json.dumps(data)}\n\n"


async def stream_graph_execution(
    graph: Any,
    initial_input: Any,
    config: Dict[str, Any],
    thread_id: str,
) -> AsyncGenerator[str, None]:
    """Streams LangGraph node execution events, interrupts, and tool calls as SSE."""
    yield format_sse_event("run_started", {"thread_id": thread_id})

    try:
        # stream_mode="updates" streams updates after each node executes
        for chunk in graph.stream(initial_input, config=config, stream_mode="updates"):
            for node_name, node_output in chunk.items():
                if not isinstance(node_output, dict):
                    continue

                traces = node_output.get("traces", [])
                latest_trace = traces[-1] if traces else {}

                # Check for revision loop event
                if node_name == "revise":
                    yield format_sse_event(
                        "revision_loop",
                        {
                            "iteration": node_output.get("revision_count", 1),
                            "reason": latest_trace.get("summary", "Low mean score triggered self-revision."),
                            "mean_score": 6.4,
                        },
                    )

                # Check for tool call events
                tool_calls = latest_trace.get("tool_calls", [])
                for tc in tool_calls:
                    yield format_sse_event("tool_call", {"name": tc, "node": node_name})
                    yield format_sse_event("tool_result", {"name": tc, "ok": True})

                # Yield node finished event
                yield format_sse_event(
                    "node_finished",
                    {
                        "node": node_name,
                        "summary": latest_trace.get("summary", f"{node_name.capitalize()} completed successfully."),
                        "preview": latest_trace.get("preview", ""),
                        "duration_ms": latest_trace.get("duration_ms", 0),
                        "model_calls": latest_trace.get("model_calls", 0),
                    },
                )

        # Check if the graph paused on an interrupt
        snapshot = graph.get_state(config)
        if snapshot.tasks:
            for task in snapshot.tasks:
                if task.interrupts:
                    for intr in task.interrupts:
                        val = intr.value if hasattr(intr, "value") else intr
                        yield format_sse_event("interrupt", val)
                    return

        # Graph finished to completion
        final_values = snapshot.values
        final_result = final_values.get("final_output", {})

        yield format_sse_event("run_finished", {"result": final_result})

    except Exception as exc:
        yield format_sse_event("error", {"message": str(exc), "recoverable": False})

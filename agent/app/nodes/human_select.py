import time
from typing import Dict, Any, List
from langgraph.types import interrupt
from ..state import AgentState


def human_select_node(state: AgentState) -> Dict[str, Any]:
    """Human-in-the-loop interrupt node: pauses execution for user to select 1-3 hooks to develop."""
    t0 = time.perf_counter()
    ranked = state.get("ranked_hooks", [])
    top_options = ranked[:3]

    options_payload = [
        {
            "hookId": h.get("hookId", h.get("id", f"hook_{idx + 1}")),
            "id": h.get("hookId", h.get("id", f"hook_{idx + 1}")),
            "displayText": h.get("displayText", h.get("text", "")),
            "text": h.get("displayText", h.get("text", "")),
            "rawText": h.get("rawText", h.get("text", "")),
            "weightedScore": h.get("weightedScore", h.get("compositeScore", 8.5)),
            "compositeScore": h.get("weightedScore", h.get("compositeScore", 8.5)),
            "critique": h.get("critique", ""),
            "scores": h.get("scores", {}),
        }
        for idx, h in enumerate(top_options)
    ]

    default_ids = [options_payload[0]["hookId"]] if options_payload else ["hook_1"]
    if len(options_payload) > 1:
        default_ids.append(options_payload[1]["hookId"])

    # LangGraph interrupt: pauses and awaits human resume payload
    human_response = interrupt({
        "kind": "select_hook",
        "title": "Select Hooks to Develop into Scripts",
        "description": "Pick 1 to 3 winning hooks for Arya's creative team to write full 15s scripts for.",
        "options": options_payload,
        "ranked_hooks": options_payload,
        "selected_hook_ids": default_ids,
        "defaultSelectedId": default_ids[0],
    })

    # Retrieve selection from resume payload
    selected_ids: List[str] = []
    if isinstance(human_response, dict) and "selected_hook_ids" in human_response:
        selected_ids = human_response["selected_hook_ids"]
    elif isinstance(human_response, list):
        selected_ids = [str(x) for x in human_response]
    elif isinstance(human_response, str):
        selected_ids = [human_response]

    # Fallback to top 1 hook if empty
    if not selected_ids and top_options:
        selected_ids = [top_options[0]["id"]]

    duration_ms = int((time.perf_counter() - t0) * 1000)

    trace_entry = {
        "node": "human_select",
        "duration_ms": duration_ms,
        "model_calls": 0,
        "summary": f"Human-in-the-loop: User selected {len(selected_ids)} hooks for parallel script generation.",
        "preview": f"Selected Hook IDs: {', '.join(selected_ids)}",
    }

    return {
        "selected_hook_ids": selected_ids,
        "traces": [trace_entry],
    }

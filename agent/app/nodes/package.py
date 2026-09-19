import time
from typing import Dict, Any
from ..state import AgentState


def package_node(state: AgentState) -> Dict[str, Any]:
    """Packages final assembled output matching the exact TypeScript JSON schema consumed by React."""
    t0 = time.perf_counter()

    scripts = state.get("scripts", [])
    storyboard = state.get("storyboard_frames", [])
    video_prompts = state.get("video_prompts", [])
    ranked_hooks = state.get("ranked_hooks", [])
    traces = state.get("traces", [])

    total_model_calls = sum(t.get("model_calls", 0) for t in traces)

    final_payload = {
        "insight": state.get("insight", ""),
        "angles": state.get("angles", []),
        "hooks": state.get("hooks", []),
        "rankedHooks": ranked_hooks,
        "scripts": scripts,
        "storyboardFrames": storyboard,
        "videoPrompts": video_prompts,
        "revisionCount": state.get("revision_count", 0),
        "totalModelCalls": total_model_calls,
    }

    duration_ms = int((time.perf_counter() - t0) * 1000)

    trace_entry = {
        "node": "package",
        "duration_ms": duration_ms,
        "model_calls": 0,
        "summary": f"Packaged complete output: {len(ranked_hooks)} hooks, {len(scripts)} scripts, {len(storyboard)} storyboard frames.",
        "preview": "Ready to ship: Scripts, Storyboards, ReelPhone preview, and Video Prompts generated.",
    }

    return {
        "final_output": final_payload,
        "traces": [trace_entry],
    }

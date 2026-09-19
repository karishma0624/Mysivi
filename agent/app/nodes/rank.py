import time
from typing import Dict, Any
from ..state import AgentState
from ..scoring import rank_evaluated_hooks


def rank_node(state: AgentState) -> Dict[str, Any]:
    """Pure algorithmic ranking node: sorts hooks by composite score and isolates top 3."""
    t0 = time.perf_counter()

    hooks = state.get("hooks", [])
    evaluations = state.get("evaluations", [])
    compliance = state.get("compliance", [])

    ranked = rank_evaluated_hooks(hooks, evaluations, compliance)
    top_3 = ranked[:3]
    mean_top_score = (
        round(sum(h["compositeScore"] for h in top_3) / len(top_3), 2)
        if top_3
        else 0.0
    )

    duration_ms = int((time.perf_counter() - t0) * 1000)

    trace_entry = {
        "node": "rank",
        "duration_ms": duration_ms,
        "model_calls": 0,
        "summary": f"Ranked {len(ranked)} hooks using 5-factor weighted optimization (Mean Top 3: {mean_top_score}).",
        "preview": f"Top hook: '{top_3[0]['text']}' (Score: {top_3[0]['compositeScore']})" if top_3 else "No top hook.",
    }

    return {
        "ranked_hooks": ranked,
        "traces": [trace_entry],
    }

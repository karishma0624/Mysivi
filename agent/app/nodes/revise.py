import time
import json
from typing import Dict, Any
from langchain_core.messages import SystemMessage, HumanMessage
from ..state import AgentState, ReviseOutputModel
from ..llm import get_llm, invoke_structured_with_backoff
from ..prompts.revise import REVISE_SYSTEM_PROMPT, REVISE_USER_TEMPLATE


def revise_node(state: AgentState) -> Dict[str, Any]:
    """Autonomous self-revision loop: rewrites low-scoring hooks using critic feedback."""
    t0 = time.perf_counter()
    llm = get_llm(temperature=0.7)

    pain_point = state.get("pain_point", "")
    audience = state.get("audience", "Job seekers")
    language = state.get("language", "Hinglish")
    hooks = state.get("hooks", [])
    evaluations = state.get("evaluations", [])
    rev_count = state.get("revision_count", 0) + 1

    # Find bottom 5 hooks based on critique
    weak_hooks = hooks[-5:] if len(hooks) >= 5 else hooks

    revise_user = REVISE_USER_TEMPLATE.format(
        pain_point=pain_point,
        audience=audience,
        language=language,
        evaluations_json=json.dumps(evaluations[:5], indent=2),
        weak_hooks_json=json.dumps(weak_hooks, indent=2),
    )

    messages = [
        SystemMessage(content=REVISE_SYSTEM_PROMPT),
        HumanMessage(content=revise_user),
    ]

    result = invoke_structured_with_backoff(llm, ReviseOutputModel, messages)
    duration_ms = int((time.perf_counter() - t0) * 1000)

    # Merge revised hooks back into hooks list
    rev_map = {rh["id"]: rh["text"] for rh in result.revisedHooks if "id" in rh and "text" in rh}
    updated_hooks = [
        {**h, "text": rev_map.get(h["id"], h["text"])}
        for h in hooks
    ]

    trace_entry = {
        "node": "revise",
        "duration_ms": duration_ms,
        "model_calls": 1,
        "summary": f"Revision {rev_count}: Rewrote {len(result.revisedHooks)} low-scoring hooks to beat quality threshold.",
        "preview": result.revisionReason[:80] + "...",
    }

    return {
        "hooks": updated_hooks,
        "revision_count": rev_count,
        "revision_notes": state.get("revision_notes", []) + [result.revisionReason],
        "traces": [trace_entry],
    }

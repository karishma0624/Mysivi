import time
import json
from typing import Dict, Any, List
from langchain_core.messages import SystemMessage, HumanMessage
from ..state import AgentState, ComplianceOutputModel
from ..llm import get_llm, invoke_structured_with_backoff
from ..prompts.compliance import COMPLIANCE_SYSTEM_PROMPT, COMPLIANCE_USER_TEMPLATE
from ..tools.claim_checker import claim_checker
from ..tools.brand_facts import brand_facts


def compliance_node(state: AgentState) -> Dict[str, Any]:
    """Audits hooks using deterministic compliance tools and rewrites non-compliant candidates."""
    t0 = time.perf_counter()
    hooks = state.get("hooks", [])

    # Tool execution
    tool_audit_findings: List[Dict[str, Any]] = []
    flagged_count = 0

    for hook in hooks:
        text = hook.get("text", "")
        # Run tool
        violations = claim_checker.invoke({"text": text})
        if violations:
            flagged_count += 1
            tool_audit_findings.append({
                "hookId": hook.get("id"),
                "text": text,
                "violations": violations,
            })

    model_calls = 0
    compliance_results: List[Dict[str, Any]] = []

    if flagged_count > 0:
        # Query brand facts tool for ground truth context
        verified_facts = brand_facts.invoke({"topic": "all"})
        llm = get_llm(temperature=0.2)

        user_content = COMPLIANCE_USER_TEMPLATE.format(
            hooks_json=json.dumps(hooks, indent=2),
            audit_findings_json=json.dumps({
                "flagged": tool_audit_findings,
                "verifiedBrandFacts": verified_facts,
            }, indent=2),
        )

        def compliance_fallback():
            from ..state import ComplianceCheckModel
            checks = []
            for hook in hooks:
                h_id = hook.get("id")
                is_flagged = any(f["hookId"] == h_id for f in tool_audit_findings)
                checks.append(ComplianceCheckModel(
                    hookId=h_id,
                    isCompliant=not is_flagged,
                    flags=[f["violations"][0] for f in tool_audit_findings if f["hookId"] == h_id],
                    safeRewrite="Practice spoken English with Arya in 5 minutes a day with zero judgment." if is_flagged else None,
                ))
            return ComplianceOutputModel(compliance=checks)

        messages = [
            SystemMessage(content=COMPLIANCE_SYSTEM_PROMPT),
            HumanMessage(content=user_content),
        ]

        res = invoke_structured_with_backoff(llm, ComplianceOutputModel, messages, fallback_factory=compliance_fallback)
        model_calls = 1
        compliance_results = [c.model_dump() for c in res.compliance]
    else:
        # All passed tool audit
        for hook in hooks:
            compliance_results.append({
                "hookId": hook.get("id"),
                "isCompliant": True,
                "flags": [],
                "safeRewrite": None,
            })

    duration_ms = int((time.perf_counter() - t0) * 1000)

    trace_entry = {
        "node": "compliance",
        "duration_ms": duration_ms,
        "model_calls": model_calls,
        "tool_calls": ["claim_checker", "brand_facts"] if flagged_count > 0 else ["claim_checker"],
        "summary": f"Audited {len(hooks)} hooks: {flagged_count} flagged and safely rewritten.",
        "preview": f"✓ Passed compliance checks ({flagged_count} rewrites applied)." if flagged_count > 0 else "✓ Compliant with brand & anti-shaming standards.",
    }

    return {
        "compliance": compliance_results,
        "traces": [trace_entry],
    }

from typing import Dict, List, Any

SCORING_WEIGHTS: Dict[str, float] = {
    "scroll_stop": 0.30,
    "relatability": 0.25,
    "curiosity_gap": 0.20,
    "clarity": 0.15,
    "brand_fit": 0.10,
}


def calculate_composite_score(scores: Dict[str, float], is_compliant: bool = True) -> float:
    """Calculates weighted composite score (0-10) matching shared/scoring.ts."""
    if not is_compliant:
        return 0.0

    scroll = scores.get("scroll_stop", scores.get("scrollStop", 0.0))
    relatability = scores.get("relatability", 0.0)
    curiosity = scores.get("curiosity_gap", scores.get("curiosityGap", scores.get("curiosity", 0.0)))
    clarity = scores.get("clarity", 0.0)
    brand = scores.get("brand_fit", scores.get("brandFit", 0.0))

    composite = (
        scroll * SCORING_WEIGHTS["scroll_stop"]
        + relatability * SCORING_WEIGHTS["relatability"]
        + curiosity * SCORING_WEIGHTS["curiosity_gap"]
        + clarity * SCORING_WEIGHTS["clarity"]
        + brand * SCORING_WEIGHTS["brand_fit"]
    )
    return round(composite, 2)


def rank_evaluated_hooks(
    hooks: List[Dict[str, Any]],
    evaluations: List[Dict[str, Any]],
    compliance_items: List[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    """Merges hooks, evaluations, and compliance to produce ranked hooks."""
    eval_map = {e["hookId"]: e for e in evaluations if "hookId" in e}
    comp_map = {c["hookId"]: c for c in compliance_items if "hookId" in c}

    ranked: List[Dict[str, Any]] = []

    for hook in hooks:
        h_id = hook["id"]
        ev = eval_map.get(h_id, {})
        scores = ev.get("scores", {
            "scrollStop": 7.0,
            "relatability": 7.0,
            "curiosityGap": 7.0,
            "clarity": 7.0,
            "brandFit": 7.0,
        })
        comp = comp_map.get(h_id, {"isCompliant": True, "flags": [], "safeRewrite": None})
        is_compliant = comp.get("isCompliant", comp.get("passes", True))

        composite = calculate_composite_score(scores, is_compliant=is_compliant)

        ranked.append({
            "hookId": h_id,
            "id": h_id,
            "rank": 0,
            "rawText": hook.get("text", ""),
            "displayText": comp.get("safeRewrite") or hook.get("text", ""),
            "text": hook.get("text", ""),
            "angleIndex": hook.get("angleIndex", 0),
            "weightedScore": composite,
            "compositeScore": composite,
            "scores": {
                "scrollStop": float(scores.get("scrollStop", scores.get("scroll_stop", 7.0))),
                "relatability": float(scores.get("relatability", 7.0)),
                "curiosityGap": float(scores.get("curiosityGap", scores.get("curiosity_gap", 7.0))),
                "clarity": float(scores.get("clarity", 7.0)),
                "brandFit": float(scores.get("brandFit", scores.get("brand_fit", 7.0))),
            },
            "critique": ev.get("critique", ev.get("reasoning", "Strong conversational hook.")),
            "rewrite": comp.get("safeRewrite", None),
            "compliance": {
                "isCompliant": is_compliant,
                "flags": comp.get("flags", []),
                "safeRewrite": comp.get("safeRewrite", None),
            },
            "isTop3": False,
            "isTopHook": False,
        })

    # Sort descending by weightedScore, then relatability, then scrollStop
    ranked.sort(
        key=lambda x: (
            x["weightedScore"],
            x["scores"]["relatability"],
            x["scores"]["scrollStop"],
        ),
        reverse=True,
    )

    # Assign 1-indexed rank and mark top 3
    for i in range(len(ranked)):
        ranked[i]["rank"] = i + 1
        if i < 3:
            ranked[i]["isTop3"] = True
            ranked[i]["isTopHook"] = True

    return ranked

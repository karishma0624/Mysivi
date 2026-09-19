from app.scoring import calculate_composite_score, rank_evaluated_hooks


def test_calculate_composite_score():
    scores = {
        "scrollStop": 10.0,
        "relatability": 10.0,
        "curiosityGap": 10.0,
        "clarity": 10.0,
        "brandFit": 10.0,
    }
    # (10 * 0.3) + (10 * 0.25) + (10 * 0.2) + (10 * 0.15) + (10 * 0.1) = 10.0
    assert calculate_composite_score(scores, is_compliant=True) == 10.0


def test_compliance_penalty():
    scores = {"scrollStop": 9.5, "relatability": 9.5, "curiosityGap": 9.0, "clarity": 9.0, "brandFit": 9.0}
    # When non-compliant, composite score must be 0.0
    assert calculate_composite_score(scores, is_compliant=False) == 0.0


def test_rank_evaluated_hooks():
    hooks = [
        {"id": "hook_1", "text": "Hook One", "angleIndex": 0},
        {"id": "hook_2", "text": "Hook Two", "angleIndex": 1},
        {"id": "hook_3", "text": "Hook Three", "angleIndex": 2},
        {"id": "hook_4", "text": "Hook Four (Non-compliant)", "angleIndex": 3},
    ]
    evaluations = [
        {"hookId": "hook_1", "scores": {"scrollStop": 9.0, "relatability": 9.0, "curiosityGap": 9.0, "clarity": 9.0, "brandFit": 9.0}},
        {"hookId": "hook_2", "scores": {"scrollStop": 8.0, "relatability": 8.0, "curiosityGap": 8.0, "clarity": 8.0, "brandFit": 8.0}},
        {"hookId": "hook_3", "scores": {"scrollStop": 7.0, "relatability": 7.0, "curiosityGap": 7.0, "clarity": 7.0, "brandFit": 7.0}},
        {"hookId": "hook_4", "scores": {"scrollStop": 10.0, "relatability": 10.0, "curiosityGap": 10.0, "clarity": 10.0, "brandFit": 10.0}},
    ]
    compliance = [
        {"hookId": "hook_1", "isCompliant": True, "flags": []},
        {"hookId": "hook_2", "isCompliant": True, "flags": []},
        {"hookId": "hook_3", "isCompliant": True, "flags": []},
        {"hookId": "hook_4", "isCompliant": False, "flags": ["GUARANTEE"]},
    ]

    ranked = rank_evaluated_hooks(hooks, evaluations, compliance)

    assert len(ranked) == 4
    # Hook 1 should be first (composite 9.0)
    assert ranked[0]["id"] == "hook_1"
    assert ranked[0]["isTopHook"] is True
    # Hook 2 should be second
    assert ranked[1]["id"] == "hook_2"
    assert ranked[1]["isTopHook"] is True
    # Hook 3 should be third
    assert ranked[2]["id"] == "hook_3"
    assert ranked[2]["isTopHook"] is True
    # Hook 4 should be penalized to the bottom (score 0.0)
    assert ranked[3]["id"] == "hook_4"
    assert ranked[3]["compositeScore"] == 0.0
    assert ranked[3]["isTopHook"] is False

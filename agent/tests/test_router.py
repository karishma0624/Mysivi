from app.graph import quality_gate, visuals_check
from app.state import AgentState


def test_quality_gate_loops_when_score_low():
    state: AgentState = {
        "hooks": [
            {"id": "hook_1", "text": "Weak hook 1"},
            {"id": "hook_2", "text": "Weak hook 2"},
            {"id": "hook_3", "text": "Weak hook 3"},
        ],
        "evaluations": [
            {"hookId": "hook_1", "scores": {"scrollStop": 5.0, "relatability": 5.0, "curiosityGap": 5.0, "clarity": 5.0, "brandFit": 5.0}},
            {"hookId": "hook_2", "scores": {"scrollStop": 5.0, "relatability": 5.0, "curiosityGap": 5.0, "clarity": 5.0, "brandFit": 5.0}},
            {"hookId": "hook_3", "scores": {"scrollStop": 5.0, "relatability": 5.0, "curiosityGap": 5.0, "clarity": 5.0, "brandFit": 5.0}},
        ],
        "revision_count": 0,
    }
    # Mean score 5.0 < 7.0 and revision_count == 0 -> should loop to "revise"
    assert quality_gate(state) == "revise"


def test_quality_gate_proceeds_when_score_high():
    state: AgentState = {
        "hooks": [
            {"id": "hook_1", "text": "Strong hook 1"},
            {"id": "hook_2", "text": "Strong hook 2"},
            {"id": "hook_3", "text": "Strong hook 3"},
        ],
        "evaluations": [
            {"hookId": "hook_1", "scores": {"scrollStop": 9.0, "relatability": 9.0, "curiosityGap": 9.0, "clarity": 9.0, "brandFit": 9.0}},
            {"hookId": "hook_2", "scores": {"scrollStop": 9.0, "relatability": 9.0, "curiosityGap": 9.0, "clarity": 9.0, "brandFit": 9.0}},
            {"hookId": "hook_3", "scores": {"scrollStop": 9.0, "relatability": 9.0, "curiosityGap": 9.0, "clarity": 9.0, "brandFit": 9.0}},
        ],
        "revision_count": 0,
    }
    # Mean score 9.0 >= 7.0 -> proceed to "compliance"
    assert quality_gate(state) == "compliance"


def test_quality_gate_stops_after_max_revisions():
    state: AgentState = {
        "hooks": [
            {"id": "hook_1", "text": "Still weak hook 1"},
            {"id": "hook_2", "text": "Still weak hook 2"},
            {"id": "hook_3", "text": "Still weak hook 3"},
        ],
        "evaluations": [
            {"hookId": "hook_1", "scores": {"scrollStop": 5.5, "relatability": 5.5, "curiosityGap": 5.5, "clarity": 5.5, "brandFit": 5.5}},
            {"hookId": "hook_2", "scores": {"scrollStop": 5.5, "relatability": 5.5, "curiosityGap": 5.5, "clarity": 5.5, "brandFit": 5.5}},
            {"hookId": "hook_3", "scores": {"scrollStop": 5.5, "relatability": 5.5, "curiosityGap": 5.5, "clarity": 5.5, "brandFit": 5.5}},
        ],
        "revision_count": 1,  # Already revised once
    }
    # Max revisions reached (1) -> proceed to "compliance" without infinite loop
    assert quality_gate(state) == "compliance"


def test_visuals_check_router():
    assert visuals_check({"generate_images": True}) == "generate_visuals"
    assert visuals_check({"generate_images": False}) == "package"
    assert visuals_check({}) == "package"

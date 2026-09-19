from app.tools.claim_checker import evaluate_claims


def test_clean_hook_passes():
    text = "You don't have bad English. You have an English-starting problem."
    violations = evaluate_claims(text)
    assert len(violations) == 0


def test_guaranteed_outcome_flagged():
    text = "Guaranteed fluent in 14 days or your money back."
    violations = evaluate_claims(text)
    assert len(violations) >= 1
    assert any("GUARANTEE" in v for v in violations)


def test_learner_shaming_flagged():
    text = "If you cannot speak English in meetings you look completely dumb and embarrassing."
    violations = evaluate_claims(text)
    assert len(violations) >= 1
    assert any("LEARNER_SHAMING" in v for v in violations)


def test_competitor_attack_flagged():
    text = "Duolingo is trash, use MySivi instead."
    violations = evaluate_claims(text)
    assert len(violations) >= 1
    assert any("COMPETITOR_ATTACK" in v for v in violations)


def test_unsupported_claim_flagged():
    text = "Join 100M+ learners on the number one app in the world."
    violations = evaluate_claims(text)
    assert len(violations) >= 1
    assert any("UNSUPPORTED_CLAIM" in v for v in violations)

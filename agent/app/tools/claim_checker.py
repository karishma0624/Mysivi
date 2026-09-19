import re
from typing import List
from langchain_core.tools import tool

# Deterministic safety and compliance violation patterns
GUARANTEE_PATTERNS = [
    r"\bguaranteed?\b",
    r"\b100%\s*(fluent|success|placement|job|offer)\b",
    r"\bfluent\s*in\s*\d+\s*(days?|weeks?|hours?)\b",
    r"\bmoney\s*back\b",
    r"\bnever\s*fail\b",
]

SHAMING_PATTERNS = [
    r"\bdumb\b",
    r"\bstupid\b",
    r"\buneducated\b",
    r"\bembarrassing\b",
    r"\bshameful\b",
    r"\blaughable\b",
    r"\bhumiliated\b",
    r"\bloser\b",
]

COMPETITOR_PATTERNS = [
    r"\b(duolingo|cambly|elsa|babbel|hellotalk)\s*(is|are)\s*(trash|garbage|scam|terrible|useless)\b",
    r"\bdon['’]t\s*use\s*(duolingo|cambly|elsa)\b",
]

UNSUPPORTED_STATS = [
    r"\b(50M|100M|1B)\+?\s*downloads\b",
    r"\b5\.0\s*star\s*rating\b",
    r"\bnumber\s*one\s*app\s*in\s*the\s*world\b",
]


def evaluate_claims(text: str) -> List[str]:
    """Pure function checking a string for compliance violations."""
    violations: List[str] = []
    text_lower = text.lower()

    for pattern in GUARANTEE_PATTERNS:
        if re.search(pattern, text_lower):
            violations.append("GUARANTEE: Claims guaranteed fluency or outcome without educational basis.")
            break

    for pattern in SHAMING_PATTERNS:
        if re.search(pattern, text_lower):
            violations.append("LEARNER_SHAMING: Employs derogatory or demoralizing language toward the learner.")
            break

    for pattern in COMPETITOR_PATTERNS:
        if re.search(pattern, text_lower):
            violations.append("COMPETITOR_ATTACK: Unprofessional disparagement of third-party platforms.")
            break

    for pattern in UNSUPPORTED_STATS:
        if re.search(pattern, text_lower):
            violations.append("UNSUPPORTED_CLAIM: Exaggerated statistics exceeding MySivi verified ground-truth.")
            break

    return violations


@tool
def claim_checker(text: str) -> List[str]:
    """Audits text for compliance flags: guaranteed outcomes, learner shaming, competitor attacks, or exaggerated claims.
    Returns a list of violation reasons. An empty list indicates full compliance.
    """
    return evaluate_claims(text)

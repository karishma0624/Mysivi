from typing import Dict, Any
from langchain_core.tools import tool

LIMITS = {
    "hook": {"max_words": 14, "recommended_words": 10},
    "reel_caption": {"max_chars": 120, "recommended_chars": 70},
    "meta_headline": {"max_chars": 40, "recommended_chars": 28},
    "meta_primary": {"max_chars": 125, "recommended_chars": 90},
}


@tool
def length_validator(text: str, field_type: str) -> Dict[str, Any]:
    """Validates whether a text string adheres to platform character and word limits.
    field_type can be 'hook', 'reel_caption', 'meta_headline', or 'meta_primary'.
    """
    field = field_type.lower().strip()
    words = len(text.strip().split())
    chars = len(text.strip())

    limit = LIMITS.get(field, LIMITS["hook"])

    valid = True
    issues = []

    if "max_words" in limit and words > limit["max_words"]:
        valid = False
        issues.append(f"Exceeds word limit ({words} > {limit['max_words']} words). Shorten for punchiness.")

    if "max_chars" in limit and chars > limit["max_chars"]:
        valid = False
        issues.append(f"Exceeds char limit ({chars} > {limit['max_chars']} chars). May truncate on mobile.")

    return {
        "valid": valid,
        "words": words,
        "chars": chars,
        "issues": issues,
    }

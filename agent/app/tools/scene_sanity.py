import re
from typing import Dict, Any, Tuple, Optional, List


SCENE_RULES: List[Dict[str, Any]] = [
    {
        "setting": "classroom_pta",
        "default_who": "mother",
        "keywords": [
            "pta",
            "parent-teacher",
            "parent teacher",
            "parents meeting",
            "report card",
            "teacher",
            "school",
            "kindergarten",
            "class teacher",
            "child",
            "kids school",
        ],
    },
    {
        "setting": "office_interview",
        "default_who": "young_woman",
        "keywords": [
            "interview",
            "hr",
            "recruiter",
            "resume",
            "job offer",
            "placement",
            "hiring manager",
            "tell me about yourself",
            "mock interview",
        ],
    },
    {
        "setting": "cafe",
        "default_who": "young_man",
        "keywords": [
            "cafe",
            "coffee",
            "order",
            "waiter",
            "barista",
            "cappuccino",
            "latte",
            "ordering coffee",
        ],
    },
    {
        "setting": "conference_room",
        "default_who": "professional_f",
        "keywords": [
            "standup",
            "scrum",
            "meeting",
            "manager",
            "boardroom",
            "client call",
            "team review",
            "sync",
            "office discussion",
        ],
    },
    {
        "setting": "college_campus",
        "default_who": "student_f",
        "keywords": [
            "presentation",
            "class",
            "college",
            "professor",
            "seminar",
            "campus",
            "lecture",
            "viva",
            "assignment",
        ],
    },
    {
        "setting": "bus_stop",
        "default_who": "young_man",
        "keywords": [
            "bus",
            "commute",
            "bus stop",
            "transit",
            "waiting for bus",
            "bus conductor",
        ],
    },
    {
        "setting": "metro_train",
        "default_who": "young_woman",
        "keywords": [
            "metro",
            "train",
            "subway",
            "tube",
            "metro station",
        ],
    },
    {
        "setting": "bedroom_study",
        "default_who": "student_m",
        "keywords": [
            "mirror",
            "bedroom",
            "late night",
            "studying alone",
            "desk practice",
        ],
    },
    {
        "setting": "dinner_table",
        "default_who": "father",
        "keywords": [
            "dinner",
            "family dinner",
            "relatives",
            "eating with family",
            "dining table",
        ],
    },
    {
        "setting": "street_market",
        "default_who": "mother",
        "keywords": [
            "market",
            "shopkeeper",
            "store",
            "bargaining",
            "street vendor",
            "groceries",
        ],
    },
]


def _find_matching_rule(text: str) -> Optional[Tuple[Dict[str, Any], str]]:
    cleaned = f" {re.sub(r'[^a-zA-Z0-9\- ]', ' ', text.lower())} "

    for rule in SCENE_RULES:
        for kw in rule["keywords"]:
            pattern = rf"(?:^|\s){re.escape(kw.replace('-', '[- ]'))}(?:\s|$)"
            if re.search(pattern, cleaned, re.IGNORECASE) or f" {kw} " in cleaned:
                return rule, kw

    return None


def scene_sanity(scene: Dict[str, Any], beat_text: str, pain_point: str) -> Tuple[Dict[str, Any], bool, Optional[str]]:
    """Checks the chosen scene against keywords in the beat voiceover, visual text and pain point.
    If the LLM's setting contradicts a strong keyword match, correct it and log 'scene corrected' in the trace;
    if no keyword matches, keep the LLM's choice.
    Returns (corrected_scene, was_corrected, reason).
    """
    combined_text = f"{beat_text or ''} {pain_point or ''}"
    match = _find_matching_rule(combined_text)

    if not match:
        return scene, False, None

    rule, matched_kw = match
    target_setting = rule["setting"]

    current_setting = scene.get("setting", "")
    if current_setting == target_setting:
        return scene, False, None

    # Contradiction: correct the scene
    corrected = dict(scene)
    corrected["setting"] = target_setting

    subject = dict(scene.get("subject", {}))
    current_who = subject.get("who", "young_woman")
    if current_who != "arya_avatar":
        subject["who"] = rule.get("default_who", current_who)
    corrected["subject"] = subject

    reason = f"scene corrected: from '{current_setting}' to '{target_setting}' due to keyword '{matched_kw}'"
    return corrected, True, reason


def enforce_script_consistency(beats: List[Dict[str, Any]], override_palette: Optional[str] = None) -> List[Dict[str, Any]]:
    """Enforces consistency across beats within a single script:
    - Keeps the same subject.who across beats unless a turn beat introduces Arya
    - Keeps harmonious palette
    """
    if not beats:
        return beats

    # 1. Identify primary protagonist
    primary_who = "young_woman"
    for b in beats:
        scene = b.get("scene") or {}
        subject = scene.get("subject") or {}
        who = subject.get("who")
        if who and who not in ("arya_avatar", "none"):
            primary_who = who
            break

    # 2. Identify base palette
    first_scene = (beats[0].get("scene") or {})
    primary_palette = override_palette or first_scene.get("palette", "warm_anxious")

    result = []
    for idx, beat in enumerate(beats):
        b_copy = dict(beat)
        scene = dict(beat.get("scene") or {})
        if scene:
            subject = dict(scene.get("subject") or {})
            beat_name = beat.get("name", "").lower()
            is_turn = idx == 2 or "turn" in beat_name or "arya" in beat_name

            if is_turn and subject.get("who") == "arya_avatar":
                subject["who"] = "arya_avatar"
            else:
                subject["who"] = primary_who

            scene["subject"] = subject
            scene["palette"] = "hopeful_lavender" if is_turn else ("bold_success" if idx == 3 else primary_palette)
            b_copy["scene"] = scene

        result.append(b_copy)

    return result

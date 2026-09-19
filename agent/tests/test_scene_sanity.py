import pytest
from app.tools.scene_sanity import scene_sanity, enforce_script_consistency

DEFAULT_SCENE = {
    "setting": "office_interview",
    "timeOfDay": "morning",
    "mood": "anxious",
    "subject": {
        "who": "young_woman",
        "action": "freezing",
        "expression": "worried",
    },
    "props": ["laptop"],
    "palette": "warm_anxious",
    "cameraMotion": "slow_zoom_in",
}


def test_pta_correction():
    scene = dict(DEFAULT_SCENE)
    corrected, was_corrected, reason = scene_sanity(
        scene,
        "Teacher asks about my son's report card in the annual parent-teacher meeting",
        "I freeze during school PTA meetings when teachers speak in English",
    )
    assert was_corrected is True
    assert corrected["setting"] == "classroom_pta"
    assert corrected["subject"]["who"] == "mother"
    assert "scene corrected" in reason


def test_interview_correction():
    scene = dict(DEFAULT_SCENE)
    scene["setting"] = "cafe"
    corrected, was_corrected, reason = scene_sanity(
        scene,
        "HR asks tell me about yourself and my mind goes blank",
        "Stuttering in job interviews with recruiters",
    )
    assert was_corrected is True
    assert corrected["setting"] == "office_interview"


def test_cafe_correction():
    scene = dict(DEFAULT_SCENE)
    corrected, was_corrected, reason = scene_sanity(
        scene,
        "Trying to order a cappuccino from the barista without getting confused",
        "Ordering coffee at modern cafes",
    )
    assert was_corrected is True
    assert corrected["setting"] == "cafe"


def test_standup_correction():
    scene = dict(DEFAULT_SCENE)
    scene["setting"] = "bedroom_study"
    corrected, was_corrected, reason = scene_sanity(
        scene,
        "Engineering manager asks for sprint update during morning standup meeting",
        "Fear of speaking up in office scrum meetings",
    )
    assert was_corrected is True
    assert corrected["setting"] == "conference_room"


def test_college_campus_correction():
    scene = dict(DEFAULT_SCENE)
    scene["setting"] = "bus_stop"
    corrected, was_corrected, reason = scene_sanity(
        scene,
        "Presenting my final year project presentation to the professor in college",
        "Stage fright during college viva",
    )
    assert was_corrected is True
    assert corrected["setting"] == "college_campus"
    assert corrected["subject"]["who"] == "student_f"


def test_bus_stop_correction():
    scene = dict(DEFAULT_SCENE)
    scene["setting"] = "classroom_pta"
    corrected, was_corrected, reason = scene_sanity(
        scene,
        "Asking the bus conductor for a ticket during morning commute",
        "Hesitation during daily bus transit",
    )
    assert was_corrected is True
    assert corrected["setting"] == "bus_stop"


def test_metro_train_correction():
    scene = dict(DEFAULT_SCENE)
    scene["setting"] = "living_room"
    corrected, was_corrected, reason = scene_sanity(
        scene,
        "Standing inside the crowded metro train holding the handrail",
        "Speaking English while travelling on the metro",
    )
    assert was_corrected is True
    assert corrected["setting"] == "metro_train"


def test_bedroom_study_correction():
    scene = dict(DEFAULT_SCENE)
    corrected, was_corrected, reason = scene_sanity(
        scene,
        "Practicing speech alone in front of bedroom mirror late night",
        "Alone at study desk trying to practice sentences",
    )
    assert was_corrected is True
    assert corrected["setting"] == "bedroom_study"


def test_dinner_table_correction():
    scene = dict(DEFAULT_SCENE)
    scene["setting"] = "street_market"
    corrected, was_corrected, reason = scene_sanity(
        scene,
        "Relatives speaking English across the dining table during dinner",
        "Family dinner conversations",
    )
    assert was_corrected is True
    assert corrected["setting"] == "dinner_table"


def test_street_market_correction():
    scene = dict(DEFAULT_SCENE)
    scene["setting"] = "cafe"
    corrected, was_corrected, reason = scene_sanity(
        scene,
        "Bargaining with the shopkeeper at the vegetable market",
        "Street market shopping in English",
    )
    assert was_corrected is True
    assert corrected["setting"] == "street_market"


def test_already_matching_setting():
    scene = dict(DEFAULT_SCENE)
    corrected, was_corrected, reason = scene_sanity(
        scene,
        "HR asks me a technical question in the second interview round",
        "I freeze in job interviews",
    )
    assert was_corrected is False
    assert corrected["setting"] == "office_interview"


def test_generic_text_keeps_llm_choice():
    scene = dict(DEFAULT_SCENE)
    scene["setting"] = "bedroom_study"
    corrected, was_corrected, reason = scene_sanity(
        scene,
        "A quiet moment of self reflection and focus",
        "General feeling of inner hesitation",
    )
    assert was_corrected is False
    assert corrected["setting"] == "bedroom_study"


def test_preserves_arya_on_turn_beat():
    scene = dict(DEFAULT_SCENE)
    scene["setting"] = "office_interview"
    scene["subject"] = {"who": "arya_avatar", "action": "holding_phone", "expression": "smiling"}
    corrected, was_corrected, reason = scene_sanity(
        scene,
        "Arya gives instant coaching for school parent teacher discussions",
        "PTA meeting nervousness",
    )
    assert was_corrected is True
    assert corrected["setting"] == "classroom_pta"
    assert corrected["subject"]["who"] == "arya_avatar"


def test_script_consistency_enforcement():
    sample_beats = [
        {
            "name": "Hook",
            "scene": {**DEFAULT_SCENE, "setting": "classroom_pta", "subject": {"who": "mother"}},
        },
        {
            "name": "Tension",
            "scene": {**DEFAULT_SCENE, "setting": "classroom_pta", "subject": {"who": "student_m"}},
        },
        {
            "name": "The Turn",
            "scene": {**DEFAULT_SCENE, "setting": "classroom_pta", "subject": {"who": "arya_avatar"}},
        },
        {
            "name": "CTA",
            "scene": {**DEFAULT_SCENE, "setting": "classroom_pta", "subject": {"who": "professional_m"}},
        },
    ]

    consistent = enforce_script_consistency(sample_beats)
    assert consistent[0]["scene"]["subject"]["who"] == "mother"
    assert consistent[1]["scene"]["subject"]["who"] == "mother"
    assert consistent[2]["scene"]["subject"]["who"] == "arya_avatar"
    assert consistent[3]["scene"]["subject"]["who"] == "mother"

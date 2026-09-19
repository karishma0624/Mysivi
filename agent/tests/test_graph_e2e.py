import pytest
from unittest.mock import patch
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import Command
from app.graph import create_growth_graph
from app.state import (
    IdeateOutputModel,
    AngleModel,
    CritiqueOutputModel,
    EvaluationModel,
    ScoresModel,
    ScriptOutputModel,
    ScriptBeatModel,
    MediaPlanOutputModel,
    StoryboardFrameModel,
    VideoPromptModel,
)

# Deterministic Mock Outputs for test
MOCK_IDEATE = IdeateOutputModel(
    insight="Learners suffer from mental translation delay and judgment fear.",
    angles=[
        AngleModel(name="The 3-Second Panic", description="Freezing before speaking."),
        AngleModel(name="Mental Delay", description="Translating in head."),
        AngleModel(name="No Judgment", description="Arya safe space."),
        AngleModel(name="Action Over Rules", description="Practice over books."),
    ],
    hooks=[
        {"id": "hook_1", "text": "You don't have bad English. You have an English-starting problem.", "angleIndex": 0},
        {"id": "hook_2", "text": "Interview room mein dimag freeze hota hai? Listen to this.", "angleIndex": 1},
        {"id": "hook_3", "text": "Stop translating Hindi to English mid-sentence.", "angleIndex": 2},
    ],
)

MOCK_CRITIQUE = CritiqueOutputModel(
    evaluations=[
        EvaluationModel(
            hookId="hook_1",
            scores=ScoresModel(scrollStop=9.2, relatability=9.4, curiosityGap=8.8, clarity=9.0, brandFit=9.2),
            critique="Exceptional psychological reframing.",
        ),
        EvaluationModel(
            hookId="hook_2",
            scores=ScoresModel(scrollStop=8.8, relatability=9.0, curiosityGap=8.5, clarity=8.8, brandFit=8.9),
            critique="Colloquial Hinglish hits home.",
        ),
        EvaluationModel(
            hookId="hook_3",
            scores=ScoresModel(scrollStop=8.4, relatability=8.7, curiosityGap=8.2, clarity=8.6, brandFit=8.7),
            critique="Direct callout of translation bottleneck.",
        ),
    ]
)

MOCK_SCRIPT = ScriptOutputModel(
    id="script_test",
    hookId="hook_1",
    title="English Starting Problem",
    targetAudience="Job seekers",
    platform="Instagram Reel",
    beats=[
        ScriptBeatModel(name="Hook", timecode="0:00 - 0:02", voiceover="You don't have bad English.", caption="Not bad English.", visual="Freeze", audioVibe="Drop"),
        ScriptBeatModel(name="Tension", timecode="0:02 - 0:06", voiceover="You freeze when asked questions.", caption="Mind blank.", visual="Split", audioVibe="Tense"),
        ScriptBeatModel(name="The Turn", timecode="0:06 - 0:12", voiceover="Arya gives 5 min daily practice.", caption="Practice with Arya.", visual="Arya wave", audioVibe="Warm"),
        ScriptBeatModel(name="CTA", timecode="0:12 - 0:15", voiceover="Download MySivi.", caption="Download app.", visual="App card", audioVibe="Outro"),
    ],
)

MOCK_MEDIA_PLAN = MediaPlanOutputModel(
    storyboardFrames=[
        StoryboardFrameModel(timecode="0:00 - 0:02", frameIndex=1, sceneDescription="Candidate frozen", imagePrompt="prompt 1", altText="alt 1"),
        StoryboardFrameModel(timecode="0:02 - 0:06", frameIndex=2, sceneDescription="Mental block", imagePrompt="prompt 2", altText="alt 2"),
        StoryboardFrameModel(timecode="0:06 - 0:12", frameIndex=3, sceneDescription="Arya call", imagePrompt="prompt 3", altText="alt 3"),
        StoryboardFrameModel(timecode="0:12 - 0:15", frameIndex=4, sceneDescription="Breakthrough", imagePrompt="prompt 4", altText="alt 4"),
    ],
    videoPrompts=[
        VideoPromptModel(shot="CU", camera="Dolly in", lighting="Warm", motion="Smooth", duration="2s", prompt="video 1", negativePrompt="blurry"),
        VideoPromptModel(shot="MS", camera="Static", lighting="Cool", motion="Subtle", duration="4s", prompt="video 2", negativePrompt="blurry"),
        VideoPromptModel(shot="OTS", camera="Pedestal up", lighting="Key light", motion="Gentle", duration="6s", prompt="video 3", negativePrompt="blurry"),
        VideoPromptModel(shot="Macro", camera="Slow pan", lighting="Bright", motion="Clean", duration="3s", prompt="video 4", negativePrompt="blurry"),
    ],
)


def mock_invoke_structured(llm, schema, messages, **kwargs):
    """Deterministic fake LLM invocation router based on schema."""
    if schema == IdeateOutputModel:
        return MOCK_IDEATE
    elif schema == CritiqueOutputModel:
        return MOCK_CRITIQUE
    elif schema == ScriptOutputModel:
        return MOCK_SCRIPT
    elif schema == MediaPlanOutputModel:
        return MOCK_MEDIA_PLAN
    raise ValueError(f"Unmapped schema in mock: {schema}")


@patch("app.nodes.ideate.invoke_structured_with_backoff", side_effect=mock_invoke_structured)
@patch("app.nodes.critique.invoke_structured_with_backoff", side_effect=mock_invoke_structured)
@patch("app.nodes.write_script.invoke_structured_with_backoff", side_effect=mock_invoke_structured)
@patch("app.nodes.media_plan.invoke_structured_with_backoff", side_effect=mock_invoke_structured)
def test_graph_e2e_interrupt_and_resume(mock_mp, mock_ws, mock_crit, mock_id):
    checkpointer = MemorySaver()
    graph = create_growth_graph(checkpointer)

    thread_config = {"configurable": {"thread_id": "test_thread_123"}}

    initial_input = {
        "pain_point": "I know English, but I freeze when someone asks me a question in an interview.",
        "audience": "Job seekers",
        "language": "Hinglish",
        "platform": "Instagram Reel",
        "tone": "Relatable",
        "generate_images": False,
    }

    # Step 1: Run graph until human_select interrupt
    events = list(graph.stream(initial_input, config=thread_config))
    assert len(events) > 0

    # Verify graph paused at human_select interrupt
    snapshot = graph.get_state(thread_config)
    assert len(snapshot.tasks) > 0
    interrupts = snapshot.tasks[0].interrupts
    assert len(interrupts) > 0
    assert interrupts[0].value["kind"] == "select_hook"
    assert len(interrupts[0].value["options"]) == 3

    # Step 2: Resume with user-selected hook IDs (selecting hook_1 and hook_2)
    resume_payload = {"selected_hook_ids": ["hook_1", "hook_2"]}
    resume_events = list(graph.stream(Command(resume=resume_payload), config=thread_config))

    # Step 3: Verify final state completed
    final_snapshot = graph.get_state(thread_config)
    assert final_snapshot.next == ()  # Reached END

    final_state = final_snapshot.values
    assert "final_output" in final_state
    output = final_state["final_output"]

    assert len(output["rankedHooks"]) >= 3
    assert len(output["scripts"]) >= 1
    assert len(output["storyboardFrames"]) == 4
    assert len(output["videoPrompts"]) == 4
    assert output["insight"] != ""

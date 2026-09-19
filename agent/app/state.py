from typing import TypedDict, List, Dict, Any, Optional, Annotated
from pydantic import BaseModel, Field


def add_scripts_reducer(existing: Optional[List[Dict[str, Any]]], new_items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Reducer that aggregates scripts generated in parallel branches, deduplicating by hookId."""
    if not existing:
        return list(new_items)
    
    combined = {s.get("hookId", s.get("id")): s for s in existing}
    for item in new_items:
        key = item.get("hookId", item.get("id"))
        combined[key] = item
    return list(combined.values())


def add_trace_reducer(existing: Optional[List[Dict[str, Any]]], new_items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Reducer that appends trace items chronologically."""
    if not existing:
        return list(new_items)
    return list(existing) + list(new_items)


# Pydantic models for structured output & validation
class AngleModel(BaseModel):
    name: str = Field(description="Short, memorable name for the creative angle")
    description: str = Field(description="Behavioral psychological explanation of the angle")


class IdeateOutputModel(BaseModel):
    insight: str = Field(description="Core psychological barrier or behavioral insight")
    angles: List[AngleModel] = Field(description="4 distinct behavioral angles")
    hooks: List[Dict[str, Any]] = Field(description="15 short hooks (<=12 words, spoken style)")


class ScoresModel(BaseModel):
    scrollStop: float = Field(ge=0.0, le=10.0, description="Ability to arrest mobile feed scrolling (0-10)")
    relatability: float = Field(ge=0.0, le=10.0, description="Visceral connection with Indian learner pain (0-10)")
    curiosityGap: float = Field(ge=0.0, le=10.0, description="Tension compelling the viewer to stay (0-10)")
    clarity: float = Field(ge=0.0, le=10.0, description="Simplicity and natural phrasing (0-10)")
    brandFit: float = Field(ge=0.0, le=10.0, description="Alignment with MySivi's friendly, zero-judgment voice (0-10)")


class EvaluationModel(BaseModel):
    hookId: str
    scores: ScoresModel
    critique: str
    rewrite: Optional[str] = None


class CritiqueOutputModel(BaseModel):
    evaluations: List[EvaluationModel]


class ReviseOutputModel(BaseModel):
    revisedHooks: List[Dict[str, Any]] = Field(description="Revised versions of low-scoring hooks")
    revisionReason: str = Field(description="Summary of why hooks were rewritten")


class ComplianceCheckModel(BaseModel):
    hookId: str
    isCompliant: bool
    flags: List[str]
    safeRewrite: Optional[str] = None


class ComplianceOutputModel(BaseModel):
    compliance: List[ComplianceCheckModel]


class SceneSubjectModel(BaseModel):
    who: str = "young_woman"
    action: str = "freezing"
    expression: str = "worried"


class SceneModel(BaseModel):
    setting: str = "office_interview"
    timeOfDay: str = "morning"
    mood: str = "anxious"
    subject: SceneSubjectModel = Field(default_factory=SceneSubjectModel)
    props: List[str] = Field(default_factory=lambda: ["laptop"])
    palette: str = "warm_anxious"
    cameraMotion: str = "slow_zoom_in"


class ScriptBeatModel(BaseModel):
    name: str
    timecode: str
    voiceover: str
    caption: str
    visual: str
    audioVibe: str
    scene: Optional[SceneModel] = None


class ScriptOutputModel(BaseModel):
    id: str
    hookId: str
    hookText: Optional[str] = None
    title: str
    beats: List[ScriptBeatModel]
    targetAudience: str
    platform: str
    estimatedDurationSeconds: int = 15


class StoryboardFrameModel(BaseModel):
    timecode: str
    frameIndex: int
    sceneDescription: str
    imagePrompt: str
    altText: str
    fallbackSvgId: str = "interview_freeze"
    imageSubject: Optional[str] = None
    scene: Optional[SceneModel] = None
    imageUrl: Optional[str] = None
    label: str = "Illustrated scene"


class VideoPromptModel(BaseModel):
    shot: str
    camera: str
    lighting: str
    motion: str
    duration: str
    prompt: str
    negativePrompt: str


class MediaPlanOutputModel(BaseModel):
    storyboardFrames: List[StoryboardFrameModel]
    videoPrompts: List[VideoPromptModel]


# Main LangGraph Agent State
class AgentState(TypedDict, total=False):
    # Inputs
    pain_point: str
    audience: str
    language: str
    platform: str
    tone: str
    generate_images: bool

    # Strategist & Hooks
    insight: str
    angles: List[Dict[str, str]]
    hooks: List[Dict[str, Any]]

    # Evaluation & Critique
    evaluations: List[Dict[str, Any]]
    compliance: List[Dict[str, Any]]

    # Quality Gate & Revision Loop
    revision_count: int
    revision_notes: List[str]
    quality_gate_passed: bool

    # Ranking & Selection
    ranked_hooks: List[Dict[str, Any]]
    selected_hook_ids: List[str]

    # Scriptwriting (Aggregated via reducer from Send branches)
    scripts: Annotated[List[Dict[str, Any]], add_scripts_reducer]

    # Media Plan
    storyboard_frames: List[Dict[str, Any]]
    video_prompts: List[Dict[str, Any]]

    # Execution telemetry & package
    traces: Annotated[List[Dict[str, Any]], add_trace_reducer]
    total_llm_calls: int
    final_output: Dict[str, Any]
    error: Optional[str]

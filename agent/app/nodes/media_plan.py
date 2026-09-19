import time
import json
from typing import Dict, Any, List
from langchain_core.messages import SystemMessage, HumanMessage
from ..state import AgentState, MediaPlanOutputModel, StoryboardFrameModel, VideoPromptModel, SceneModel, SceneSubjectModel
from ..llm import get_llm, invoke_structured_with_backoff
from ..prompts.visual_director import VISUAL_DIRECTOR_SYSTEM_PROMPT, VISUAL_DIRECTOR_USER_TEMPLATE
from ..prompts.video_prompt_writer import VIDEO_PROMPT_WRITER_SYSTEM_PROMPT
from ..tools.scene_sanity import scene_sanity, enforce_script_consistency


def media_plan_node(state: AgentState) -> Dict[str, Any]:
    """Generates 4 vertical storyboard frame briefs and text-to-video diffusion prompts with scene sanity checking."""
    t0 = time.perf_counter()
    llm = get_llm(temperature=0.7)

    pain_point = state.get("pain_point", "")
    scripts = state.get("scripts", [])
    primary_script = scripts[0] if scripts else {
        "title": "Default Reel",
        "beats": [
            {"name": "Hook", "timecode": "0:00 - 0:02", "voiceover": "Starting problem", "caption": "Starting problem", "visual": "Candidate frozen", "audioVibe": "Bass hit"},
            {"name": "Tension", "timecode": "0:02 - 0:06", "voiceover": "Mental block", "caption": "Mental block", "visual": "Split screen", "audioVibe": "Tension"},
            {"name": "The Turn", "timecode": "0:06 - 0:12", "voiceover": "Arya practice", "caption": "Arya practice", "visual": "Arya wave", "audioVibe": "Uplifting"},
            {"name": "CTA", "timecode": "0:12 - 0:15", "voiceover": "Download app", "caption": "Download app", "visual": "App CTA", "audioVibe": "Outro"},
        ]
    }

    user_prompt = VISUAL_DIRECTOR_USER_TEMPLATE.format(
        title=primary_script.get("title", "15s Reel"),
        beats_json=json.dumps(primary_script.get("beats", []), indent=2),
    )

    combined_system = f"{VISUAL_DIRECTOR_SYSTEM_PROMPT}\n\n{VIDEO_PROMPT_WRITER_SYSTEM_PROMPT}"
    combined_user = f"{user_prompt}\n\nAlso include 4 text-to-video diffusion prompts matching each beat."

    def media_plan_fallback():
        # Determine base setting from pain point
        initial_setting = "office_interview"
        initial_who = "young_woman"
        pp_lower = pain_point.lower()
        if any(w in pp_lower for w in ["pta", "school", "parent", "teacher"]):
            initial_setting = "classroom_pta"
            initial_who = "mother"
        elif any(w in pp_lower for w in ["cafe", "coffee", "order", "waiter"]):
            initial_setting = "cafe"
            initial_who = "young_man"
        elif any(w in pp_lower for w in ["standup", "manager", "meeting"]):
            initial_setting = "conference_room"
            initial_who = "professional_m"
        elif any(w in pp_lower for w in ["presentation", "college", "professor"]):
            initial_setting = "college_campus"
            initial_who = "student_f"
        elif any(w in pp_lower for w in ["bus", "commute"]):
            initial_setting = "bus_stop"
            initial_who = "young_man"

        return MediaPlanOutputModel(
            storyboardFrames=[
                StoryboardFrameModel(
                    timecode="0:00 - 0:02",
                    frameIndex=1,
                    sceneDescription=f"Learner frozen in {initial_setting.replace('_', ' ')}, eyes showing sudden hesitation",
                    imagePrompt=f"Cinematic portrait of learner in {initial_setting.replace('_', ' ')}, shallow depth of field, 9:16 vertical",
                    altText="The Hook Freeze",
                    fallbackSvgId="interview_freeze",
                    scene=SceneModel(
                        setting=initial_setting,
                        timeOfDay="morning",
                        mood="anxious",
                        subject=SceneSubjectModel(who=initial_who, action="freezing", expression="worried"),
                        props=["laptop" if "interview" in initial_setting else "notebook"],
                        palette="warm_anxious",
                        cameraMotion="slow_zoom_in",
                    ),
                ),
                StoryboardFrameModel(
                    timecode="0:02 - 0:06",
                    frameIndex=2,
                    sceneDescription="Internal mental block and struggle to find English words",
                    imagePrompt=f"Learner looking down in {initial_setting.replace('_', ' ')}, soft rim light, 9:16 vertical",
                    altText="Mental block",
                    fallbackSvgId="mirror_practice",
                    scene=SceneModel(
                        setting=initial_setting,
                        timeOfDay="morning",
                        mood="hesitant",
                        subject=SceneSubjectModel(who=initial_who, action="looking_down", expression="awkward_smile"),
                        props=["resume_folder" if "interview" in initial_setting else "coffee_cup"],
                        palette="warm_anxious",
                        cameraMotion="pan_right",
                    ),
                ),
                StoryboardFrameModel(
                    timecode="0:06 - 0:12",
                    frameIndex=3,
                    sceneDescription="Mobile screen glowing: Arya AI waving with friendly lavender waveform pulse",
                    imagePrompt="Modern smartphone displaying friendly Arya AI tutor with lavender glow, 9:16 vertical",
                    altText="Arya speaking practice",
                    fallbackSvgId="arya_call",
                    scene=SceneModel(
                        setting=initial_setting,
                        timeOfDay="afternoon",
                        mood="hopeful",
                        subject=SceneSubjectModel(who="arya_avatar", action="holding_phone", expression="smiling"),
                        props=["phone_with_mysivi"],
                        palette="hopeful_lavender",
                        cameraMotion="slow_zoom_in",
                    ),
                ),
                StoryboardFrameModel(
                    timecode="0:12 - 0:15",
                    frameIndex=4,
                    sceneDescription="Learner speaking fluently with confident posture and warm smile",
                    imagePrompt=f"Confident learner in {initial_setting.replace('_', ' ')} with proud posture, golden hour light, 9:16 vertical",
                    altText="Speaking breakthrough",
                    fallbackSvgId="speaking_breakthrough",
                    scene=SceneModel(
                        setting=initial_setting,
                        timeOfDay="afternoon",
                        mood="confident",
                        subject=SceneSubjectModel(who=initial_who, action="speaking_confidently", expression="confident"),
                        props=["none"],
                        palette="bold_success",
                        cameraMotion="static",
                    ),
                ),
            ],
            videoPrompts=[
                VideoPromptModel(shot="CU", camera="Subtle 1.1x slow push-in", lighting="Soft 4000K daylight", motion="Slow natural breathing", duration="2s", prompt="Close up of Indian learner, eyes showing sudden hesitation, 24fps cinematic 9:16", negativePrompt="blurry, amateur"),
                VideoPromptModel(shot="MS", camera="Static locked off", lighting="Warm key light with cool rim", motion="Subtle hesitation posture", duration="4s", prompt="Medium shot of realistic setting, slight depth of field blur, cinematic color grade, 24fps", negativePrompt="blurry, bad anatomy"),
                VideoPromptModel(shot="OTS", camera="Pedestal up 15cm", lighting="Vibrant smartphone screen glow", motion="Gentle handheld sway", duration="6s", prompt="Over the shoulder shot of learner holding phone, Arya AI avatar smiling, clean lavender UI, 24fps", negativePrompt="blurry, distorted fingers"),
                VideoPromptModel(shot="MS", camera="Slow tracking backward", lighting="Golden hour sunny lighting", motion="Empowered speaking", duration="3s", prompt="Confident learner stepping forward with natural proud posture, cinematic 24fps", negativePrompt="blurry, jitter"),
            ],
        )

    messages = [
        SystemMessage(content=combined_system),
        HumanMessage(content=combined_user),
    ]

    result = invoke_structured_with_backoff(llm, MediaPlanOutputModel, messages, fallback_factory=media_plan_fallback)
    duration_ms = int((time.perf_counter() - t0) * 1000)

    frames = [f.model_dump() for f in result.storyboardFrames]
    prompts = [p.model_dump() for p in result.videoPrompts]

    # Run Relevance Guard (scene_sanity) on each frame
    corrections_logged: List[str] = []
    beats = primary_script.get("beats", [])

    for idx, frame in enumerate(frames):
        beat_info = beats[idx] if idx < len(beats) else {}
        beat_text = f"{beat_info.get('voiceover', '')} {beat_info.get('visual', '')} {frame.get('sceneDescription', '')}"
        current_scene = frame.get("scene")

        if current_scene:
            corrected_scene, was_corrected, reason = scene_sanity(current_scene, beat_text, pain_point)
            if was_corrected:
                frame["scene"] = corrected_scene
                log_msg = f"Frame {frame.get('frameIndex', idx + 1)}: {reason}"
                corrections_logged.append(log_msg)
                print(f"[RELEVANCE GUARD] scene corrected: {log_msg}")

    # Enforce script consistency across beats
    script_beats_with_scenes = []
    for idx, b in enumerate(beats):
        b_dict = dict(b)
        if idx < len(frames) and frames[idx].get("scene"):
            b_dict["scene"] = frames[idx]["scene"]
        script_beats_with_scenes.append(b_dict)

    consistent_beats = enforce_script_consistency(script_beats_with_scenes)
    for idx, b in enumerate(consistent_beats):
        if idx < len(frames) and "scene" in b:
            frames[idx]["scene"] = b["scene"]

    trace_entry = {
        "node": "media_plan",
        "duration_ms": duration_ms,
        "model_calls": 1,
        "summary": f"Formulated {len(frames)} vertical storyboard scenes and diffusion camera prompts." + (
            f" ({len(corrections_logged)} scene corrections applied)" if corrections_logged else ""
        ),
        "preview": f"Primary visual scene: {frames[0]['sceneDescription'][:60]}..." if frames else "Media plan ready.",
        "corrections": corrections_logged,
    }

    return {
        "storyboard_frames": frames,
        "video_prompts": prompts,
        "traces": [trace_entry],
    }

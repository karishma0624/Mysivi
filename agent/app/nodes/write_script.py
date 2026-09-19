import time
from typing import Dict, Any
from langchain_core.messages import SystemMessage, HumanMessage
from ..state import ScriptOutputModel
from ..llm import get_llm, invoke_structured_with_backoff
from ..prompts.script_director import SCRIPT_DIRECTOR_SYSTEM_PROMPT, SCRIPT_DIRECTOR_USER_TEMPLATE


def write_script_node(worker_input: Dict[str, Any]) -> Dict[str, Any]:
    """Parallel fan-out worker node: generates a 15s 4-beat narrative script for a single selected hook."""
    t0 = time.perf_counter()
    llm = get_llm(temperature=0.7)

    hook_id = worker_input.get("hook_id", "hook_1")
    hook_text = worker_input.get("hook_text", "")
    audience = worker_input.get("audience", "Job seekers")
    language = worker_input.get("language", "Hinglish")
    platform = worker_input.get("platform", "Instagram Reel")
    tone = worker_input.get("tone", "Relatable")

    prompt_user = SCRIPT_DIRECTOR_USER_TEMPLATE.format(
        hook_id=hook_id,
        hook_text=hook_text,
        audience=audience,
        language=language,
        tone=tone,
        platform=platform,
    )

    messages = [
        SystemMessage(content=SCRIPT_DIRECTOR_SYSTEM_PROMPT),
        HumanMessage(content=prompt_user),
    ]

    def script_fallback():
        from ..state import ScriptBeatModel
        return ScriptOutputModel(
            id=f"script_{hook_id}",
            hookId=hook_id,
            title=f"Script: {hook_text[:30]}...",
            targetAudience=audience,
            platform=platform,
            beats=[
                ScriptBeatModel(name="Hook", timecode="0:00 - 0:02", voiceover=hook_text, caption=hook_text, visual="Candidate in high-stakes environment looking frozen, sharp snap to camera.", audioVibe="Sharp bass drop, instant silence."),
                ScriptBeatModel(name="Tension", timecode="0:02 - 0:06", voiceover="You know what to say in your head, but your mouth freezes the moment someone asks in English.", caption="Thoughts fluent. Tongue frozen.", visual="Close up: rapid eye movement, internal panic vs external silence.", audioVibe="Subtle ticking tension."),
                ScriptBeatModel(name="The Turn", timecode="0:06 - 0:12", voiceover="Arya gives you 5 minutes of low-stakes conversation practice every single day. No human judging, just confidence.", caption="5 mins with Arya. Zero human judgment.", visual="Phone screen illuminates: Arya waving with vibrant waveform.", audioVibe="Warm uplifting synth chord."),
                ScriptBeatModel(name="CTA", timecode="0:12 - 0:15", voiceover="Download MySivi today and practice before your next big interview.", caption="Download MySivi App 📲", visual="MySivi card with 10M+ downloads and 4.7★ Play Store rating.", audioVibe="Crisp acoustic outro chime."),
            ],
        )

    result = invoke_structured_with_backoff(llm, ScriptOutputModel, messages, fallback_factory=script_fallback)
    duration_ms = int((time.perf_counter() - t0) * 1000)

    script_dict = result.model_dump()
    script_dict["hookId"] = hook_id
    script_dict["hookText"] = hook_text or script_dict.get("hookText") or (script_dict.get("beats") and script_dict["beats"][0].get("voiceover", ""))

    trace_entry = {
        "node": f"write_script_{hook_id}",
        "duration_ms": duration_ms,
        "model_calls": 1,
        "summary": f"Generated 15s narrative script for '{hook_text[:35]}...'",
        "preview": f"Script: {script_dict['title']} (4 beats)",
    }

    return {
        "scripts": [script_dict],
        "traces": [trace_entry],
    }

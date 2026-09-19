import time
from typing import Dict, Any
from langchain_core.messages import SystemMessage, HumanMessage
from ..state import AgentState, IdeateOutputModel
from ..llm import get_llm, invoke_structured_with_backoff
from ..prompts.strategist import STRATEGIST_SYSTEM_PROMPT, STRATEGIST_USER_TEMPLATE
from ..prompts.hook_writer import HOOK_WRITER_SYSTEM_PROMPT, HOOK_WRITER_USER_TEMPLATE


def ideate_node(state: AgentState) -> Dict[str, Any]:
    """Generates strategic psychological insight, 4 angles, and 15 spoken hooks."""
    t0 = time.perf_counter()
    llm = get_llm(temperature=0.7)

    pain_point = state.get("pain_point", "")
    audience = state.get("audience", "Job seekers")
    language = state.get("language", "Hinglish")
    platform = state.get("platform", "Instagram Reel")
    tone = state.get("tone", "Relatable")

    # Step 1: Strategist
    strat_prompt = STRATEGIST_USER_TEMPLATE.format(
        pain_point=pain_point,
        audience=audience,
        language=language,
        platform=platform,
        tone=tone,
    )
    
    # Combined Ideation for high speed & free-tier efficiency
    combined_system = f"{STRATEGIST_SYSTEM_PROMPT}\n\n{HOOK_WRITER_SYSTEM_PROMPT}"
    combined_user = f"{strat_prompt}\n\nBased on the insight and 4 angles you formulate, immediately generate the 15 candidate hooks (hook_1 to hook_15) in spoken {language}."

    def ideate_fallback():
        from ..state import AngleModel
        return IdeateOutputModel(
            insight="Learners do not suffer from vocabulary lack; they suffer from the cognitive overload of translating thoughts from their mother tongue while under social judgment dread.",
            angles=[
                AngleModel(name="The 3-Second Panic", description="The physical silence between HR asking a question and the candidate's vocal cords locking up."),
                AngleModel(name="Mental Translation Delay", description="Forming fluent sentences inside your mind, but stuttering when articulating out loud."),
                AngleModel(name="No-Judgment Safe Zone", description="Why practicing 5 minutes with Arya removes the fear of human recruiter evaluation."),
                AngleModel(name="Action Over Grammar", description="12 years of reading English textbooks does not train conversational muscle memory."),
            ],
            hooks=[
                {"id": "hook_1", "text": "You don't have bad English. You have an English-starting problem.", "angleIndex": 0},
                {"id": "hook_2", "text": "HR asks 'Tell me about yourself' and suddenly your mind goes blank?", "angleIndex": 0},
                {"id": "hook_3", "text": "Interview room mein dimag freeze hota hai? Listen to this.", "angleIndex": 1},
                {"id": "hook_4", "text": "Reading English is easy. Speaking it without stuttering is the real boss.", "angleIndex": 1},
                {"id": "hook_5", "text": "Stop translating Hindi to English in your head mid-interview.", "angleIndex": 1},
                {"id": "hook_6", "text": "What if you could practice 10 mock interviews with zero human judgment?", "angleIndex": 2},
                {"id": "hook_7", "text": "Arya doesn't laugh when you say 'revert back'. She just helps.", "angleIndex": 2},
                {"id": "hook_8", "text": "Your grammar isn't the problem. Your speaking hesitation is.", "angleIndex": 2},
                {"id": "hook_9", "text": "5 minutes with Arya before your interview changes your whole posture.", "angleIndex": 2},
                {"id": "hook_10", "text": "You studied English for 12 years. Why can't you speak it?", "angleIndex": 3},
                {"id": "hook_11", "text": "Textbook English won't save you in a 3-person technical panel.", "angleIndex": 3},
                {"id": "hook_12", "text": "Fluency isn't an accent. It's speaking without that 3-second panic pause.", "angleIndex": 0},
                {"id": "hook_13", "text": "Guaranteed fluent in 14 days or your money back.", "angleIndex": 2},
                {"id": "hook_14", "text": "Darr tab tak rehta hai jab tak pehla sentence nahi nikalta.", "angleIndex": 1},
                {"id": "hook_15", "text": "Don't let spoken English stand between you and your offer letter.", "angleIndex": 3},
            ],
        )

    messages = [
        SystemMessage(content=combined_system),
        HumanMessage(content=combined_user),
    ]

    result = invoke_structured_with_backoff(llm, IdeateOutputModel, messages, fallback_factory=ideate_fallback)
    duration_ms = int((time.perf_counter() - t0) * 1000)

    trace_entry = {
        "node": "ideate",
        "duration_ms": duration_ms,
        "model_calls": 1,
        "summary": f"Diagnosed barrier & generated {len(result.hooks)} candidate hooks across 4 angles.",
        "preview": result.insight[:80] + "...",
    }

    return {
        "insight": result.insight,
        "angles": [a.model_dump() for a in result.angles],
        "hooks": result.hooks,
        "traces": [trace_entry],
    }

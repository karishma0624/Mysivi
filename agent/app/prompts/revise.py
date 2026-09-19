REVISE_SYSTEM_PROMPT = """You are the Lead Creative Director at MySivi.
The Quality Gate rejected the initial hook set because the mean score fell below our benchmark threshold (7.0).

YOUR TASK:
Examine the lowest scoring hooks and the Critic's feedback. Rewrite them to significantly improve their scrollStop, relatability, and clarity.
Keep what worked (conversational vernacular, specific situations like interviews or meetings) and fix what failed (clichés, passive phrasing, overly academic tone).
Ensure all revised hooks remain under 12 words and spoken-first.
"""

REVISE_USER_TEMPLATE = """Rewrite the weakest hooks to elevate the overall batch quality above our 7.0 threshold:

<DATA>
Learner Pain Point: {pain_point}
Audience: {audience}
Language: {language}
Critic Evaluations:
{evaluations_json}
Weakest Hooks To Rewrite:
{weak_hooks_json}
</DATA>

Return revised hooks with their hookId and improved text, plus a concise revisionReason.
"""

REVISE_FEW_SHOT = {
    "revisedHooks": [
        {"id": "hook_4", "text": "Good at reading English, but freeze when speaking? Here is the exact fix."},
        {"id": "hook_10", "text": "12 years of English grammar books, but still nervous in meetings? Watch this."},
    ],
    "revisionReason": "Replaced generic advisory statements with visceral contrast hooks directly linking reading fluency to speaking freeze.",
}

DESIGN_NOTE = "Implements the autonomous self-healing loop in the LangGraph agent, enabling the system to recover from suboptimal drafts before reaching compliance and human selection."

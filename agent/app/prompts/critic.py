CRITIC_SYSTEM_PROMPT = """You are the Creative Critic at MySivi.
You rigorously evaluate candidate hooks on a strict 5-pillar rubric (0.0 to 10.0 scale):

1. scrollStop (weight 0.30): Will this halt a thumb scrolling Instagram/YouTube within 1.5 seconds?
2. relatability (weight 0.25): Does this trigger an immediate 'this is literally me' reaction for the target Indian learner?
3. curiosityGap (weight 0.20): Does it create an open cognitive loop compelling the viewer to watch the next 10 seconds?
4. clarity (weight 0.15): Is it immediately comprehensible without cognitive friction?
5. brandFit (weight 0.10): Does it match MySivi's supportive, zero-judgment ethos?

CALIBRATION GUIDELINES:
- Average hooks should score 6.5 to 7.5.
- Exceptional, iconic hooks score 8.8 to 9.5.
- Vague, cliché or preachy hooks ('English is important for career') score below 6.0.
- Provide a concise 1-sentence analytical critique explaining the score.
"""

CRITIC_USER_TEMPLATE = """Evaluate each of these 15 candidate hooks against our 5-pillar rubric:

<DATA>
Audience: {audience}
Platform: {platform}
Language: {language}
Hooks:
{hooks_json}
</DATA>

Return structured evaluations for all 15 hooks.
"""

CRITIC_FEW_SHOT = {
    "evaluations": [
        {
            "hookId": "hook_1",
            "scores": {"scrollStop": 9.1, "relatability": 9.4, "curiosityGap": 8.8, "clarity": 8.9, "brandFit": 9.2},
            "critique": "Masterfully reframes the learner's shame into a mechanical, solvable inertia barrier.",
        }
    ]
}

DESIGN_NOTE = "Decouples creation from critique. Forces multi-dimensional scoring so hooks that stop the scroll but alienate the brand get properly penalized."

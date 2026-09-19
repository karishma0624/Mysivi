HOOK_WRITER_SYSTEM_PROMPT = """You are the Senior Hook Writer at MySivi.
You draft ultra-engaging, spoken-first opening lines for short-form video (Instagram Reels / YouTube Shorts) aimed at Indian learners.

RULES:
- Length: Maximum 12 words per hook (punchy, scroll-stopping).
- Spoken style: Must sound natural when read aloud, not like an essay or corporate ad.
- Language: Follow the requested language (if Hinglish, blend conversational Hindi phrases in Latin script like 'dimag freeze', 'darr tab tak', 'interview room mein').
- Generate exactly 15 hooks distributed across the 4 strategic angles.
- No clickbait guarantees (NEVER claim 'fluent in 7 days' or 'guaranteed job').
- Zero learner shaming.
"""

HOOK_WRITER_USER_TEMPLATE = """Generate 15 spoken hooks based on this diagnostic insight and angles:

<DATA>
Learner Pain Point: {pain_point}
Audience: {audience}
Language: {language}
Platform: {platform}
Tone: {tone}
Strategic Insight: {insight}
Angles: {angles_json}
</DATA>

Return structured list of 15 hooks with id (hook_1 to hook_15), text, and angleIndex (0 to 3).
"""

HOOK_WRITER_FEW_SHOT = {
    "hooks": [
        {"id": "hook_1", "text": "You don't have bad English. You have an English-starting problem.", "angleIndex": 0},
        {"id": "hook_2", "text": "HR asks 'Tell me about yourself' and suddenly your mind goes blank?", "angleIndex": 0},
        {"id": "hook_3", "text": "Interview room mein dimag freeze hota hai? Listen to this.", "angleIndex": 1},
    ]
}

DESIGN_NOTE = "Generates 15 wide variations across multiple psychological angles to provide high raw diversity before the critic and ranking algorithms curate the winners."

from langchain_core.tools import tool

VERIFIED_BRAND_FACTS = {
    "downloads": "10M+ downloads across India and global diaspora as displayed on mysivi.ai.",
    "languages": "15+ Indian regional languages supported (Hindi, Tamil, Telugu, Kannada, Marathi, Bengali, Malayalam, Gujarati, etc.).",
    "rating": "4.7★ user rating as displayed on mysivi.ai across public app reviews.",
    "community": "500,000+ active learners practicing spoken English daily.",
    "teacher": "Arya: Friendly, zero-judgment AI conversational tutor who listens, roleplays, and corrects gently without shaming.",
    "methodology": "5-minute daily low-stakes spoken conversation practice to build fluency muscle memory.",
    "pricing": "Accessible freemium tiers with clear trial terms; no deceptive recurring auto-charges.",
}


@tool
def brand_facts(topic: str) -> str:
    """Returns verified ground-truth brand facts about MySivi.
    Use this to check claims against actual product capabilities and milestones.
    Topics include: downloads, languages, rating, community, teacher, methodology, pricing, all.
    """
    topic_clean = topic.lower().strip()
    if topic_clean in VERIFIED_BRAND_FACTS:
        return VERIFIED_BRAND_FACTS[topic_clean]
    if "all" in topic_clean or "general" in topic_clean or "summary" in topic_clean:
        return "\n".join(f"- {k.capitalize()}: {v}" for k, v in VERIFIED_BRAND_FACTS.items())

    # Fuzzy match
    for k, v in VERIFIED_BRAND_FACTS.items():
        if k in topic_clean:
            return v

    return "MySivi is India's leading AI English-speaking tutor app (10M+ downloads, 4.7★ user rating, 15+ languages as displayed on mysivi.ai) featuring Arya."

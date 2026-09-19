from typing import List, Dict, Any

from .strategist import STRATEGIST_SYSTEM_PROMPT, STRATEGIST_USER_TEMPLATE, STRATEGIST_FEW_SHOT, DESIGN_NOTE as STRATEGIST_NOTE
from .hook_writer import HOOK_WRITER_SYSTEM_PROMPT, HOOK_WRITER_USER_TEMPLATE, HOOK_WRITER_FEW_SHOT, DESIGN_NOTE as HOOK_WRITER_NOTE
from .critic import CRITIC_SYSTEM_PROMPT, CRITIC_USER_TEMPLATE, CRITIC_FEW_SHOT, DESIGN_NOTE as CRITIC_NOTE
from .revise import REVISE_SYSTEM_PROMPT, REVISE_USER_TEMPLATE, REVISE_FEW_SHOT, DESIGN_NOTE as REVISE_NOTE
from .compliance import COMPLIANCE_SYSTEM_PROMPT, COMPLIANCE_USER_TEMPLATE, COMPLIANCE_FEW_SHOT, DESIGN_NOTE as COMPLIANCE_NOTE
from .script_director import SCRIPT_DIRECTOR_SYSTEM_PROMPT, SCRIPT_DIRECTOR_USER_TEMPLATE, SCRIPT_DIRECTOR_FEW_SHOT, DESIGN_NOTE as SCRIPT_NOTE
from .visual_director import VISUAL_DIRECTOR_SYSTEM_PROMPT, VISUAL_DIRECTOR_USER_TEMPLATE, DESIGN_NOTE as VISUAL_NOTE
from .video_prompt_writer import VIDEO_PROMPT_WRITER_SYSTEM_PROMPT, VIDEO_PROMPT_WRITER_USER_TEMPLATE, DESIGN_NOTE as VIDEO_PROMPT_NOTE


def get_all_prompts_metadata() -> List[Dict[str, Any]]:
    """Returns metadata for all agent prompts to expose via GET /prompts."""
    return [
        {
            "id": "strategist",
            "name": "Strategist",
            "role": "Psychological Barrier Diagnosis",
            "system": STRATEGIST_SYSTEM_PROMPT,
            "userTemplate": STRATEGIST_USER_TEMPLATE,
            "fewShot": STRATEGIST_FEW_SHOT,
            "designNote": STRATEGIST_NOTE,
        },
        {
            "id": "hookWriter",
            "name": "Hook Writer",
            "role": "15 Spoken Hooks Generation",
            "system": HOOK_WRITER_SYSTEM_PROMPT,
            "userTemplate": HOOK_WRITER_USER_TEMPLATE,
            "fewShot": HOOK_WRITER_FEW_SHOT,
            "designNote": HOOK_WRITER_NOTE,
        },
        {
            "id": "critic",
            "name": "Creative Critic",
            "role": "5-Pillar Rubric Scoring",
            "system": CRITIC_SYSTEM_PROMPT,
            "userTemplate": CRITIC_USER_TEMPLATE,
            "fewShot": CRITIC_FEW_SHOT,
            "designNote": CRITIC_NOTE,
        },
        {
            "id": "revise",
            "name": "Self-Revision Loop",
            "role": "Autonomous Quality Gate Recovery",
            "system": REVISE_SYSTEM_PROMPT,
            "userTemplate": REVISE_USER_TEMPLATE,
            "fewShot": REVISE_FEW_SHOT,
            "designNote": REVISE_NOTE,
        },
        {
            "id": "compliance",
            "name": "Compliance Guard",
            "role": "Tool-Assisted Brand Safety Audit",
            "system": COMPLIANCE_SYSTEM_PROMPT,
            "userTemplate": COMPLIANCE_USER_TEMPLATE,
            "fewShot": COMPLIANCE_FEW_SHOT,
            "designNote": COMPLIANCE_NOTE,
        },
        {
            "id": "scriptDirector",
            "name": "Script Director",
            "role": "15s Timed Narrative 4-Beats (Parallel Fan-Out)",
            "system": SCRIPT_DIRECTOR_SYSTEM_PROMPT,
            "userTemplate": SCRIPT_DIRECTOR_USER_TEMPLATE,
            "fewShot": SCRIPT_DIRECTOR_FEW_SHOT,
            "designNote": SCRIPT_NOTE,
        },
        {
            "id": "visualDirector",
            "name": "Visual Director",
            "role": "9:16 Vertical Storyboard Layout",
            "system": VISUAL_DIRECTOR_SYSTEM_PROMPT,
            "userTemplate": VISUAL_DIRECTOR_USER_TEMPLATE,
            "designNote": VISUAL_NOTE,
        },
        {
            "id": "videoPromptWriter",
            "name": "Video Prompt Engineer",
            "role": "Text-to-Video Diffusion Formulations",
            "system": VIDEO_PROMPT_WRITER_SYSTEM_PROMPT,
            "userTemplate": VIDEO_PROMPT_WRITER_USER_TEMPLATE,
            "designNote": VIDEO_PROMPT_NOTE,
        },
    ]

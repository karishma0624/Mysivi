import time
from typing import Dict, Any, List
from ..state import AgentState
from ..tools.image_gen import image_gen


def generate_visuals_node(state: AgentState) -> Dict[str, Any]:
    """Optional node: generates diffusion images for storyboard frames, gracefully falling back on quota."""
    t0 = time.perf_counter()

    frames = state.get("storyboard_frames", [])
    updated_frames: List[Dict[str, Any]] = []
    generated_count = 0
    quota_encountered = False

    for frame in frames:
        frame_copy = dict(frame)
        prompt = frame.get("imagePrompt", "")

        if not quota_encountered and prompt:
            res = image_gen.invoke({"prompt": prompt})
            if res.get("is_generated"):
                frame_copy["imageUrl"] = res["image_url"]
                frame_copy["label"] = "AI-generated"
                generated_count += 1
            elif res.get("is_quota"):
                quota_encountered = True
                frame_copy["imageUrl"] = None
                frame_copy["label"] = "Illustrated scene"
            else:
                frame_copy["imageUrl"] = None
                frame_copy["label"] = "Illustrated scene"
        else:
            frame_copy["imageUrl"] = None
            frame_copy["label"] = "Illustrated scene"

        updated_frames.append(frame_copy)

    duration_ms = int((time.perf_counter() - t0) * 1000)

    trace_entry = {
        "node": "generate_visuals",
        "duration_ms": duration_ms,
        "model_calls": 0,
        "tool_calls": ["image_gen"] * (generated_count + (1 if quota_encountered else 0)),
        "summary": f"Visuals: Generated {generated_count} AI images ({'Quota limit hit - graceful illustrated scene' if quota_encountered else 'Clean execution'}).",
        "preview": f"{generated_count} frames generated, remaining using custom SVG illustrated scene.",
    }

    return {
        "storyboard_frames": updated_frames,
        "traces": [trace_entry],
    }

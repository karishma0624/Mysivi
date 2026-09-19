from typing import Dict, Any
from langchain_core.tools import tool
import httpx
from ..config import settings


@tool
def image_gen(prompt: str) -> Dict[str, Any]:
    """Generates a photorealistic vertical 9:16 scene image for a storyboard beat.
    Returns image data URL or graceful fallback on quota limits.
    """
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY in ("paste_your_key_here", "your_gemini_api_key_here"):
        return {
            "is_generated": False,
            "image_url": None,
            "label": "Illustrated scene",
            "reason": "Missing or placeholder GEMINI_API_KEY",
        }

    # Attempt image generation via Gemini REST API
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_IMAGE_MODEL}:predict?key={settings.GEMINI_API_KEY}"
    payload = {
        "instances": [{"prompt": prompt}],
        "parameters": {
            "sampleCount": 1,
            "aspectRatio": "9:16",
        },
    }

    try:
        with httpx.Client(timeout=20.0) as client:
            resp = client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                predictions = data.get("predictions", [])
                if predictions and "bytesBase64Encoded" in predictions[0]:
                    b64 = predictions[0]["bytesBase64Encoded"]
                    mime = predictions[0].get("mimeType", "image/png")
                    return {
                        "is_generated": True,
                        "image_url": f"data:{mime};base64,{b64}",
                        "label": "AI-generated",
                    }

            if resp.status_code in (429, 403, 404):
                return {
                    "is_generated": False,
                    "image_url": None,
                    "label": "Illustrated scene",
                    "reason": f"Quota or model limit (HTTP {resp.status_code})",
                    "is_quota": True,
                }
    except Exception as exc:
        return {
            "is_generated": False,
            "image_url": None,
            "label": "Illustrated scene",
            "reason": str(exc),
        }

    return {
        "is_generated": False,
        "image_url": None,
        "label": "Illustrated scene",
        "reason": "Default fallback",
    }

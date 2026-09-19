import time
import re
from typing import Type, TypeVar, Optional, Any, Callable
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
from .config import settings

T = TypeVar("T", bound=BaseModel)

class LLMCallTracker:
    def __init__(self, max_calls: int = 15):
        self.max_calls = max_calls
        self.call_count = 0

    def increment(self):
        self.call_count += 1
        if self.call_count > self.max_calls:
            raise RuntimeError(f"Run exceeded maximum allowed LLM calls ({self.max_calls}). Free-tier budget safeguard triggered.")

    def reset(self):
        self.call_count = 0


tracker = LLMCallTracker(max_calls=settings.MAX_RUN_LLM_CALLS)


def get_llm(temperature: float = 0.7, timeout: float = 30.0) -> ChatGoogleGenerativeAI:
    """Factory returning configured ChatGoogleGenerativeAI instance."""
    api_key = settings.GEMINI_API_KEY or "fake_key_for_testing"
    return ChatGoogleGenerativeAI(
        model=settings.GEMINI_TEXT_MODEL,
        google_api_key=api_key,
        temperature=temperature,
        timeout=timeout,
        max_retries=2,
    )


def invoke_structured_with_backoff(
    llm: Any,
    schema: Type[T],
    messages: list,
    max_retries: int = 3,
    fallback_factory: Optional[Callable[[], T]] = None,
) -> T:
    """Invokes structured LLM output with adaptive backoff on 429/ResourceExhausted."""
    tracker.increment()

    structured_llm = llm.with_structured_output(schema)
    last_error: Optional[Exception] = None

    for attempt in range(max_retries):
        try:
            return structured_llm.invoke(messages)
        except Exception as exc:
            last_error = exc
            err_str = str(exc).lower()
            is_quota_or_unavailable = (
                "429" in err_str
                or "503" in err_str
                or "unavailable" in err_str
                or "high demand" in err_str
                or "resource_exhausted" in err_str
                or "quota" in err_str
            )

            if "perday" in err_str or "generaterequestsperday" in err_str:
                if fallback_factory:
                    print("[LLM Fallback] Daily project quota reached. Activating graceful verified fallback.")
                    return fallback_factory()

            if is_quota_or_unavailable and attempt < max_retries - 1:
                match = re.search(r"retry in (\d+)", err_str)
                wait_sec = min(float(match.group(1)) + 0.5, 4.0) if match else 2.0
                print(f"[LLM Backoff] Quota/Transient wait (attempt {attempt+1}/{max_retries}): {wait_sec:.1f}s...")
                time.sleep(wait_sec)
                continue

            if attempt >= max_retries - 1:
                if fallback_factory:
                    print(f"[LLM Fallback] Quota exhausted after {max_retries} attempts. Activating graceful fallback.")
                    return fallback_factory()
                raise last_error

    if fallback_factory:
        return fallback_factory()

    raise last_error if last_error else RuntimeError("Failed to invoke structured LLM output.")

from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Google Gemini API
    GEMINI_API_KEY: str = Field(default="", description="Google Gemini API Key")
    # Pinned exact model ID (avoid aliases to ensure reproducible latency and behavior)
    GEMINI_TEXT_MODEL: str = Field(default="gemini-2.0-flash", description="Pinned Gemini text model ID")
    GEMINI_IMAGE_MODEL: str = Field(default="imagen-3.0-generate-002", description="Gemini image model ID")

    # Security & CORS
    ALLOWED_ORIGINS: List[str] = Field(
        default=["http://localhost:3000", "http://127.0.0.1:3000"],
        description="Allowed CORS origin URLs",
    )

    # Cost & Free-Tier Guardrails
    MAX_RUN_LLM_CALLS: int = Field(default=15, description="Max LLM calls permitted in a single graph run")
    QUALITY_THRESHOLD: float = Field(default=7.0, description="Minimum mean score required to bypass revision")
    MAX_REVISIONS: int = Field(default=1, description="Maximum self-revision attempts in quality gate")
    MAX_CONCURRENT_RUNS: int = Field(default=2, description="Global concurrency cap for running graphs")
    RATE_LIMIT_HOURLY_PER_IP: int = Field(default=10, description="Max runs per hour per client IP")
    RATE_LIMIT_DAILY_GLOBAL: int = Field(default=100, description="Global daily run cap")
    THREAD_TTL_SECONDS: int = Field(default=3600, description="Thread memory TTL in seconds (1 hour)")

    # Environment
    PORT: int = Field(default=8000, description="Server port")
    HOST: str = Field(default="0.0.0.0", description="Server host")


settings = Settings()

import time
from typing import Dict, List, Set
from fastapi import HTTPException
from .config import settings


class ConcurrencyManager:
    """Limits max concurrent running graphs to avoid hitting free-tier memory or API limits."""
    def __init__(self, max_concurrent: int = 2):
        self.max_concurrent = max_concurrent
        self._active_thread_ids: Set[str] = set()

    def acquire(self, thread_id: str):
        if len(self._active_thread_ids) >= self.max_concurrent:
            raise HTTPException(
                status_code=429,
                detail="Server busy: Max concurrent agent runs reached. Please wait a few seconds and retry.",
            )
        self._active_thread_ids.add(thread_id)

    def release(self, thread_id: str):
        self._active_thread_ids.discard(thread_id)


class RateLimiter:
    """Manages per-IP hourly caps and global daily caps."""
    def __init__(self):
        self._ip_timestamps: Dict[str, List[float]] = {}
        self._global_timestamps: List[float] = []

    def check_and_record(self, ip: str):
        now = time.time()
        one_hour_ago = now - 3600
        one_day_ago = now - 86400

        # Clean old global timestamps
        self._global_timestamps = [t for t in self._global_timestamps if t > one_day_ago]
        if len(self._global_timestamps) >= settings.RATE_LIMIT_DAILY_GLOBAL:
            raise HTTPException(
                status_code=429,
                detail="Global daily agent run cap reached. Please try again tomorrow.",
            )

        # Clean IP timestamps
        ip_history = [t for t in self._ip_timestamps.get(ip, []) if t > one_hour_ago]
        if len(ip_history) >= settings.RATE_LIMIT_HOURLY_PER_IP:
            raise HTTPException(
                status_code=429,
                detail="Hourly rate limit reached for this IP. Please try again later.",
            )

        ip_history.append(now)
        self._ip_timestamps[ip] = ip_history
        self._global_timestamps.append(now)


class ThreadRegistry:
    """Tracks active threads with TTL cleanup so old checkpoints don't leak memory."""
    def __init__(self, ttl_seconds: int = 3600):
        self.ttl_seconds = ttl_seconds
        self._threads: Dict[str, float] = {}

    def register(self, thread_id: str):
        self.cleanup()
        self._threads[thread_id] = time.time()

    def exists(self, thread_id: str) -> bool:
        self.cleanup()
        return thread_id in self._threads

    def touch(self, thread_id: str):
        if thread_id in self._threads:
            self._threads[thread_id] = time.time()

    def cleanup(self):
        now = time.time()
        cutoff = now - self.ttl_seconds
        expired = [tid for tid, ts in self._threads.items() if ts < cutoff]
        for tid in expired:
            del self._threads[tid]


concurrency_manager = ConcurrencyManager(max_concurrent=settings.MAX_CONCURRENT_RUNS)
rate_limiter = RateLimiter()
thread_registry = ThreadRegistry(ttl_seconds=settings.THREAD_TTL_SECONDS)

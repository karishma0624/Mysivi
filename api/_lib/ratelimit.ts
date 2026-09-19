/**
 * In-Memory Best-Effort Rate Limiting for Serverless Functions
 * Respects free tier limits without requiring external Redis/DB.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const ipRequestMap = new Map<string, RateLimitRecord>();
let globalDailyRuns = 0;
let globalResetDate = new Date().toDateString();

export function checkRateLimit(ip: string): {
  allowed: boolean;
  retryAfterSeconds?: number;
  reason?: string;
} {
  // Reset global count daily
  const today = new Date().toDateString();
  if (today !== globalResetDate) {
    globalResetDate = today;
    globalDailyRuns = 0;
  }

  const maxGlobalPerDay = Number(process.env.LIVE_IMAGE_RUNS_PER_DAY_GLOBAL || 40);
  if (globalDailyRuns >= maxGlobalPerDay) {
    return {
      allowed: false,
      reason: 'Global daily demo capacity reached. Please view the instant sample run.',
    };
  }

  const maxPerHour = Number(process.env.LIVE_RUNS_PER_HOUR_PER_IP || 5);
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour

  const record = ipRequestMap.get(ip);

  if (!record || now > record.resetTime) {
    ipRequestMap.set(ip, { count: 1, resetTime: now + windowMs });
    globalDailyRuns++;
    return { allowed: true };
  }

  if (record.count >= maxPerHour) {
    const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
    return {
      allowed: false,
      retryAfterSeconds,
      reason: `Hourly rate limit exceeded (${record.count}/${maxPerHour}). Falling back to sample run.`,
    };
  }

  record.count++;
  globalDailyRuns++;
  return { allowed: true };
}

import type { VercelResponse } from '@vercel/node';

export function sendSuccess<T>(res: VercelResponse, data: T, status: number = 200): void {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
  res.status(status).json({
    success: true,
    data,
  });
}

export function sendError(
  res: VercelResponse,
  code: string,
  message: string,
  status: number = 400
): void {
  res.setHeader('Content-Type', 'application/json');
  res.status(status).json({
    success: false,
    error: code,
    message,
  });
}

export function sendQuotaError(
  res: VercelResponse,
  message: string = 'Gemini API free tier rate limit reached. Loading verified sample run.'
): void {
  res.setHeader('Content-Type', 'application/json');
  res.status(429).json({
    success: false,
    error: 'quota',
    message,
  });
}

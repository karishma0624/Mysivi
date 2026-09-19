import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ZodSchema } from 'zod';
import { sendError } from './respond';

export function validateRequest<T>(
  req: VercelRequest,
  res: VercelResponse,
  schema: ZodSchema<T>
): T | null {
  if (req.method !== 'POST') {
    sendError(res, 'method_not_allowed', 'Only POST requests are allowed on this endpoint.', 405);
    return null;
  }

  const parseResult = schema.safeParse(req.body);
  if (!parseResult.success) {
    const errorDetails = parseResult.error.errors
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join('; ');
    sendError(res, 'invalid_payload', `Validation failed: ${errorDetails}`, 400);
    return null;
  }

  return parseResult.data;
}

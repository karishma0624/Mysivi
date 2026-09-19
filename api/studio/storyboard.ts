import type { VercelRequest, VercelResponse } from '@vercel/node';
import { StoryboardGenerateInputSchema } from '../../shared/schemas';
import { validateRequest } from '../_lib/validate';
import { checkRateLimit } from '../_lib/ratelimit';
import { callGeminiImage } from '../_lib/gemini';
import { sendSuccess, sendQuotaError } from '../_lib/respond';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const body = validateRequest(req, res, StoryboardGenerateInputSchema);
  if (!body) return;

  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    sendQuotaError(res, rateLimit.reason);
    return;
  }

  const { frameIndex, imagePrompt, fallbackSvgId } = body;

  const result = await callGeminiImage(imagePrompt);

  if (result.isQuota) {
    sendQuotaError(res);
    return;
  }

  if (result.imageUrl) {
    sendSuccess(res, {
      frameIndex,
      imageUrl: result.imageUrl,
      isGenerated: true,
      label: 'AI-generated',
      description: `Vertical 9:16 generated scene for frame ${frameIndex}`,
    });
    return;
  }

  // Graceful fallback to SVG illustration
  sendSuccess(res, {
    frameIndex,
    imageUrl: null,
    isGenerated: false,
    label: 'Illustrated fallback',
    description: `Vector SVG scene art: ${fallbackSvgId}`,
  });
}

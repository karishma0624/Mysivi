import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { adVariantWriterPrompt } from '../../shared/prompts';
import { validateRequest } from '../_lib/validate';
import { checkRateLimit } from '../_lib/ratelimit';
import { callGeminiJson } from '../_lib/gemini';
import { sendSuccess, sendQuotaError } from '../_lib/respond';
import { SAMPLE_AD_VARIANTS } from '../../src/data/samples/ads.sample';

const AdsGenerateInputSchema = z.object({
  hooks: z.array(z.string()).min(1).max(5),
  audience: z.string(),
  language: z.string(),
});

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const body = validateRequest(req, res, AdsGenerateInputSchema);
  if (!body) return;

  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    sendQuotaError(res, rateLimit.reason);
    return;
  }

  const { hooks, audience, language } = body;

  const promptText = adVariantWriterPrompt.userTemplate
    .replace('{{hooks}}', JSON.stringify(hooks))
    .replace('{{audience}}', audience)
    .replace('{{language}}', language);

  const adRes = await callGeminiJson({
    systemInstruction: adVariantWriterPrompt.system,
    prompt: promptText,
    schema: adVariantWriterPrompt.schema,
  });

  if (adRes.isQuota) {
    sendQuotaError(res);
    return;
  }

  if (adRes.data?.variants && adRes.data.variants.length >= 3) {
    sendSuccess(res, adRes.data);
    return;
  }

  sendSuccess(res, { variants: SAMPLE_AD_VARIANTS });
}

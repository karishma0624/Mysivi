import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PainPointInputSchema, StudioIdeateOutputSchema } from '../../shared/schemas';
import { strategistPrompt, hookWriterPrompt } from '../../shared/prompts';
import { validateRequest } from '../_lib/validate';
import { sanitizeString } from '../_lib/sanitize';
import { checkRateLimit } from '../_lib/ratelimit';
import { callGeminiJson } from '../_lib/gemini';
import { sendSuccess, sendQuotaError } from '../_lib/respond';
import { SAMPLE_IDEATE_OUTPUT } from '../../src/data/samples/studio.sample';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const body = validateRequest(req, res, PainPointInputSchema);
  if (!body) return;

  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    sendQuotaError(res, rateLimit.reason);
    return;
  }

  const painPoint = sanitizeString(body.painPoint, 200);
  const { audience, language, platform, tone } = body;

  // Step 1: Strategist
  const strategistPromptText = strategistPrompt.userTemplate
    .replace('{{painPoint}}', painPoint)
    .replace('{{audience}}', audience)
    .replace('{{language}}', language)
    .replace('{{platform}}', platform)
    .replace('{{tone}}', tone);

  const strategistRes = await callGeminiJson({
    systemInstruction: strategistPrompt.system,
    prompt: strategistPromptText,
    schema: strategistPrompt.schema,
  });

  if (strategistRes.isQuota) {
    sendQuotaError(res);
    return;
  }

  // Fallback to sample if live call failed
  const strategistData = strategistRes.data || {
    insight: SAMPLE_IDEATE_OUTPUT.insight,
    angles: SAMPLE_IDEATE_OUTPUT.angles,
  };

  // Step 2: Hook Writer
  const hookWriterPromptText = hookWriterPrompt.userTemplate
    .replace('{{painPoint}}', painPoint)
    .replace('{{audience}}', audience)
    .replace('{{language}}', language)
    .replace('{{platform}}', platform)
    .replace('{{tone}}', tone)
    .replace('{{insight}}', strategistData.insight)
    .replace('{{angles}}', JSON.stringify(strategistData.angles));

  const hookWriterRes = await callGeminiJson({
    systemInstruction: hookWriterPrompt.system,
    prompt: hookWriterPromptText,
    schema: hookWriterPrompt.schema,
  });

  if (hookWriterRes.isQuota) {
    sendQuotaError(res);
    return;
  }

  const hooksData = hookWriterRes.data?.hooks || SAMPLE_IDEATE_OUTPUT.hooks;

  const responsePayload = {
    insight: strategistData.insight,
    angles: strategistData.angles,
    hooks: hooksData,
  };

  const validation = StudioIdeateOutputSchema.safeParse(responsePayload);
  if (!validation.success) {
    sendSuccess(res, SAMPLE_IDEATE_OUTPUT);
    return;
  }

  sendSuccess(res, validation.data);
}

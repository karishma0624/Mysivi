import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { scriptDirectorPrompt } from '../../shared/prompts';
import { validateRequest } from '../_lib/validate';
import { checkRateLimit } from '../_lib/ratelimit';
import { callGeminiJson } from '../_lib/gemini';
import { sendSuccess, sendQuotaError } from '../_lib/respond';
import { SAMPLE_SCRIPTS_OUTPUT } from '../../src/data/samples/studio.sample';

const ScriptsInputSchema = z.object({
  topHooks: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    })
  ).length(3),
  language: z.string(),
  audience: z.string(),
  tone: z.string(),
  platform: z.string(),
});

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const body = validateRequest(req, res, ScriptsInputSchema);
  if (!body) return;

  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    sendQuotaError(res, rateLimit.reason);
    return;
  }

  const { topHooks, language, audience, tone, platform } = body;

  const promptText = scriptDirectorPrompt.userTemplate
    .replace('{{topHooks}}', JSON.stringify(topHooks))
    .replace('{{language}}', language)
    .replace('{{audience}}', audience)
    .replace('{{tone}}', tone)
    .replace('{{platform}}', platform);

  const scriptRes = await callGeminiJson({
    systemInstruction: scriptDirectorPrompt.system,
    prompt: promptText,
    schema: scriptDirectorPrompt.schema,
  });

  if (scriptRes.isQuota) {
    sendQuotaError(res);
    return;
  }

  if (scriptRes.data && scriptRes.data.scripts && scriptRes.data.scripts.length === 3) {
    sendSuccess(res, scriptRes.data);
    return;
  }

  sendSuccess(res, SAMPLE_SCRIPTS_OUTPUT);
}

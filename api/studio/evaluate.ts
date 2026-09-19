import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { HookItemSchema, StudioEvaluateOutputSchema } from '../../shared/schemas';
import { criticPrompt, complianceGuardPrompt } from '../../shared/prompts';
import { validateRequest } from '../_lib/validate';
import { checkRateLimit } from '../_lib/ratelimit';
import { callGeminiJson } from '../_lib/gemini';
import { sendSuccess, sendQuotaError } from '../_lib/respond';
import { SAMPLE_EVALUATE_OUTPUT } from '../../src/data/samples/studio.sample';

const EvaluateInputSchema = z.object({
  hooks: z.array(HookItemSchema).length(15),
  audience: z.string(),
  platform: z.string(),
  language: z.string(),
});

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const body = validateRequest(req, res, EvaluateInputSchema);
  if (!body) return;

  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    sendQuotaError(res, rateLimit.reason);
    return;
  }

  const { hooks, audience, platform, language } = body;

  // 1. Critic evaluation
  const criticPromptText = criticPrompt.userTemplate
    .replace('{{audience}}', audience)
    .replace('{{platform}}', platform)
    .replace('{{language}}', language)
    .replace('{{hooks}}', JSON.stringify(hooks));

  const criticRes = await callGeminiJson({
    systemInstruction: criticPrompt.system,
    prompt: criticPromptText,
    schema: criticPrompt.schema,
  });

  if (criticRes.isQuota) {
    sendQuotaError(res);
    return;
  }

  // 2. Compliance Guard
  const compliancePromptText = complianceGuardPrompt.userTemplate.replace(
    '{{hooks}}',
    JSON.stringify(hooks)
  );

  const complianceRes = await callGeminiJson({
    systemInstruction: complianceGuardPrompt.system,
    prompt: compliancePromptText,
    schema: complianceGuardPrompt.schema,
  });

  if (complianceRes.isQuota) {
    sendQuotaError(res);
    return;
  }

  // Merge critic & compliance
  const criticEvals = criticRes.data?.evaluations || SAMPLE_EVALUATE_OUTPUT.evaluations;
  const complianceChecks = complianceRes.data?.checks || [];

  const complianceMap = new Map(complianceChecks.map((c) => [c.hookId, c]));

  const mergedEvaluations = criticEvals.map((ce) => {
    const comp = complianceMap.get(ce.hookId) || {
      isCompliant: true,
      flags: [],
      safeRewrite: null,
    };

    return {
      hookId: ce.hookId,
      scores: ce.scores,
      critique: ce.critique,
      rewrite: ce.rewrite || null,
      compliance: {
        isCompliant: comp.isCompliant,
        flags: comp.flags,
        safeRewrite: comp.safeRewrite,
      },
    };
  });

  const parsed = StudioEvaluateOutputSchema.safeParse({ evaluations: mergedEvaluations });
  if (!parsed.success) {
    sendSuccess(res, SAMPLE_EVALUATE_OUTPUT);
    return;
  }

  sendSuccess(res, parsed.data);
}

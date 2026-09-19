import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { StudioMediaPlanOutputSchema, ScriptItemSchema } from '../../shared/schemas';
import { visualDirectorPrompt, videoPromptWriterPrompt } from '../../shared/prompts';
import { validateRequest } from '../_lib/validate';
import { checkRateLimit } from '../_lib/ratelimit';
import { callGeminiJson } from '../_lib/gemini';
import { sendSuccess, sendQuotaError } from '../_lib/respond';
import { SAMPLE_MEDIA_PLAN_OUTPUT } from '../../src/data/samples/studio.sample';

const MediaPlanInputSchema = z.object({
  primaryScript: ScriptItemSchema,
});

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const body = validateRequest(req, res, MediaPlanInputSchema);
  if (!body) return;

  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    sendQuotaError(res, rateLimit.reason);
    return;
  }

  const { primaryScript } = body;

  // 1. Visual Director
  const visualPromptText = visualDirectorPrompt.userTemplate.replace(
    '{{script}}',
    JSON.stringify(primaryScript)
  );

  const visualRes = await callGeminiJson({
    systemInstruction: visualDirectorPrompt.system,
    prompt: visualPromptText,
    schema: visualDirectorPrompt.schema,
  });

  if (visualRes.isQuota) {
    sendQuotaError(res);
    return;
  }

  const frames = visualRes.data?.storyboardFrames || SAMPLE_MEDIA_PLAN_OUTPUT.storyboardFrames;

  // 2. Video Prompt Writer
  const videoPromptText = videoPromptWriterPrompt.userTemplate.replace(
    '{{frames}}',
    JSON.stringify(frames)
  );

  const videoRes = await callGeminiJson({
    systemInstruction: videoPromptWriterPrompt.system,
    prompt: videoPromptText,
    schema: videoPromptWriterPrompt.schema,
  });

  if (videoRes.isQuota) {
    sendQuotaError(res);
    return;
  }

  const prompts = videoRes.data?.videoPrompts || SAMPLE_MEDIA_PLAN_OUTPUT.videoPrompts;

  const combinedPayload = {
    storyboardFrames: frames,
    videoPrompts: prompts,
  };

  const parsed = StudioMediaPlanOutputSchema.safeParse(combinedPayload);
  if (!parsed.success) {
    sendSuccess(res, SAMPLE_MEDIA_PLAN_OUTPUT);
    return;
  }

  sendSuccess(res, parsed.data);
}

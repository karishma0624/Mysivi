import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ViralPlanInputSchema, ViralPlanOutputSchema } from '../../shared/schemas';
import {
  trendAdapterPrompt,
  calendarPlannerPrompt,
  creatorBriefPrompt,
  viralityChecklistPrompt,
} from '../../shared/prompts';
import { validateRequest } from '../_lib/validate';
import { sanitizeString } from '../_lib/sanitize';
import { checkRateLimit } from '../_lib/ratelimit';
import { callGeminiJson } from '../_lib/gemini';
import { sendSuccess, sendQuotaError } from '../_lib/respond';
import { SAMPLE_VIRAL_PLAN } from '../../src/data/samples/viral.sample';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const body = validateRequest(req, res, ViralPlanInputSchema);
  if (!body) return;

  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    sendQuotaError(res, rateLimit.reason);
    return;
  }

  const trendDescription = sanitizeString(body.trendDescription, 300);
  const { language, audience, goal = 'Drive spoken practice engagement' } = body;

  // 1. Trend Adapter
  const adapterText = trendAdapterPrompt.userTemplate
    .replace('{{trendDescription}}', trendDescription)
    .replace('{{audience}}', audience)
    .replace('{{language}}', language)
    .replace('{{goal}}', goal);

  const adapterRes = await callGeminiJson({
    systemInstruction: trendAdapterPrompt.system,
    prompt: adapterText,
    schema: trendAdapterPrompt.schema,
  });

  if (adapterRes.isQuota) {
    sendQuotaError(res);
    return;
  }

  const adaptations = adapterRes.data?.adaptations || SAMPLE_VIRAL_PLAN.trendAdaptations;

  // 2. Calendar Planner
  const calendarText = calendarPlannerPrompt.userTemplate
    .replace('{{theme}}', trendDescription)
    .replace('{{audience}}', audience)
    .replace('{{language}}', language);

  const calendarRes = await callGeminiJson({
    systemInstruction: calendarPlannerPrompt.system,
    prompt: calendarText,
    schema: calendarPlannerPrompt.schema,
  });

  if (calendarRes.isQuota) {
    sendQuotaError(res);
    return;
  }

  const calendar = calendarRes.data?.calendar || SAMPLE_VIRAL_PLAN.calendar;

  // 3. Creator Briefs
  const briefsText = creatorBriefPrompt.userTemplate
    .replace('{{focus}}', trendDescription)
    .replace('{{audience}}', audience)
    .replace('{{language}}', language);

  const briefsRes = await callGeminiJson({
    systemInstruction: creatorBriefPrompt.system,
    prompt: briefsText,
    schema: creatorBriefPrompt.schema,
  });

  if (briefsRes.isQuota) {
    sendQuotaError(res);
    return;
  }

  const creatorBriefs = briefsRes.data?.creatorBriefs || SAMPLE_VIRAL_PLAN.creatorBriefs;

  // 4. Virality Checklist
  const checklistText = viralityChecklistPrompt.userTemplate
    .replace('{{concept}}', adaptations[0]?.hook || trendDescription)
    .replace('{{audience}}', audience);

  const checklistRes = await callGeminiJson({
    systemInstruction: viralityChecklistPrompt.system,
    prompt: checklistText,
    schema: viralityChecklistPrompt.schema,
  });

  if (checklistRes.isQuota) {
    sendQuotaError(res);
    return;
  }

  const viralityChecklist = checklistRes.data?.viralityChecklist || SAMPLE_VIRAL_PLAN.viralityChecklist;

  const combined = {
    trendDescription,
    trendAdaptations: adaptations,
    calendar,
    creatorBriefs,
    viralityChecklist,
  };

  const parsed = ViralPlanOutputSchema.safeParse(combined);
  if (!parsed.success) {
    sendSuccess(res, SAMPLE_VIRAL_PLAN);
    return;
  }

  sendSuccess(res, parsed.data);
}

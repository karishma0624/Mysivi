import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AdsExplainInputSchema, AdsExplainOutputSchema } from '../../shared/schemas';
import { adExplainerPrompt } from '../../shared/prompts';
import { validateRequest } from '../_lib/validate';
import { checkRateLimit } from '../_lib/ratelimit';
import { callGeminiJson } from '../_lib/gemini';
import { sendSuccess, sendQuotaError } from '../_lib/respond';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const body = validateRequest(req, res, AdsExplainInputSchema);
  if (!body) return;

  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    sendQuotaError(res, rateLimit.reason);
    return;
  }

  const {
    variantId,
    variantName,
    impressions,
    clicks,
    installs,
    spend,
    ctr,
    cpi,
    zScoreCtr,
    pValueCtr,
    zScoreCpi,
    verdict,
  } = body;

  const promptText = adExplainerPrompt.userTemplate
    .replace('{{variantId}}', variantId)
    .replace('{{variantName}}', variantName)
    .replace('{{verdict}}', verdict)
    .replace('{{impressions}}', String(impressions))
    .replace('{{clicks}}', String(clicks))
    .replace('{{installs}}', String(installs))
    .replace('{{spend}}', String(spend))
    .replace('{{ctr}}', String(ctr))
    .replace('{{cpi}}', String(cpi))
    .replace('{{zScoreCtr}}', zScoreCtr !== null ? String(zScoreCtr) : 'N/A')
    .replace('{{pValueCtr}}', pValueCtr !== null ? String(pValueCtr) : 'N/A')
    .replace('{{zScoreCpi}}', zScoreCpi !== null ? String(zScoreCpi) : 'N/A');

  const explainRes = await callGeminiJson({
    systemInstruction: adExplainerPrompt.system,
    prompt: promptText,
    schema: adExplainerPrompt.schema,
    temperature: 0.3, // more deterministic for quantitative explanation
  });

  if (explainRes.isQuota) {
    sendQuotaError(res);
    return;
  }

  if (explainRes.data) {
    sendSuccess(res, explainRes.data);
    return;
  }

  // Fallback deterministic template explanation
  let fallbackExplanation = '';
  let statisticalInsight = '';
  let nextAction = '';

  if (verdict === 'SCALE') {
    fallbackExplanation = `CPI of ₹${cpi.toFixed(2)} is well below the target benchmark, accompanied by strong engagement metrics.`;
    statisticalInsight = `With ${impressions.toLocaleString()} impressions and ${installs} installs, the variant exhibits statistically robust performance lift over the control.`;
    nextAction = 'Scale daily budget allocation to 70% and test complementary hook variations.';
  } else if (verdict === 'KILL') {
    fallbackExplanation = `CPI of ₹${cpi.toFixed(2)} is significantly above acceptable unit economics thresholds.`;
    statisticalInsight = `Sufficient sample volume indicates high statistical probability that this variant will remain unprofitable.`;
    nextAction = 'Pause variant immediately and redirect ad spend to top-performing creative.';
  } else {
    fallbackExplanation = `Early performance shows promise at ₹${cpi.toFixed(2)} CPI, but sample volume remains inconclusive.`;
    statisticalInsight = `P-value ${pValueCtr ?? 'inconclusive'} has not yet achieved the 95% statistical significance threshold.`;
    nextAction = 'Maintain equal exploratory test budget until minimum 15 installs are accumulated.';
  }

  const fallbackPayload = {
    variantId,
    verdict,
    plainEnglishVerdict: fallbackExplanation,
    statisticalInsight,
    whatToTestNext: nextAction,
  };

  const parsed = AdsExplainOutputSchema.safeParse(fallbackPayload);
  sendSuccess(res, parsed.success ? parsed.data : fallbackPayload);
}

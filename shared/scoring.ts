import {
  HookItem,
  HookEvaluation,
  RankedHook,
  HookScoreRubric,
} from './types';

export const SCORING_WEIGHTS = {
  scrollStop: 0.30,
  relatability: 0.25,
  curiosityGap: 0.20,
  clarity: 0.15,
  brandFit: 0.10,
} as const;

/**
 * Calculates weighted score from the 5 rubric criteria.
 * Formula: Scroll-stop .30, Relatability .25, Curiosity .20, Clarity .15, Brand fit .10
 * Returns score rounded to 2 decimal places.
 */
export function calculateWeightedScore(scores: HookScoreRubric): number {
  const raw =
    scores.scrollStop * SCORING_WEIGHTS.scrollStop +
    scores.relatability * SCORING_WEIGHTS.relatability +
    scores.curiosityGap * SCORING_WEIGHTS.curiosityGap +
    scores.clarity * SCORING_WEIGHTS.clarity +
    scores.brandFit * SCORING_WEIGHTS.brandFit;

  return Math.round(raw * 100) / 100;
}

/**
 * Ranks all hooks based on their weighted rubric score.
 * Enforces compliance guardrails:
 * If a hook has compliance flags and a safe rewrite, the displayText is set to the safe rewrite.
 * Top 3 are elevated with isTop3 = true.
 */
export function rankHooks(
  hooks: HookItem[],
  evaluations: HookEvaluation[]
): RankedHook[] {
  const evalMap = new Map<string, HookEvaluation>();
  evaluations.forEach((e) => evalMap.set(e.hookId, e));

  const ranked: RankedHook[] = hooks.map((h) => {
    const evaluation = evalMap.get(h.id) || {
      hookId: h.id,
      scores: {
        scrollStop: 5,
        relatability: 5,
        clarity: 5,
        curiosityGap: 5,
        brandFit: 5,
      },
      critique: 'Standard evaluation pending.',
      rewrite: null,
      compliance: {
        isCompliant: true,
        flags: [],
        safeRewrite: null,
      },
    };

    const weightedScore = calculateWeightedScore(evaluation.scores);
    const hasFlags =
      !evaluation.compliance.isCompliant ||
      evaluation.compliance.flags.length > 0;
    const safeRewrite = evaluation.compliance.safeRewrite;

    // If compliance flag exists, use safe rewrite for display if provided
    const displayText = hasFlags && safeRewrite ? safeRewrite : h.text;

    return {
      hookId: h.id,
      rank: 1, // temporary placeholder
      rawText: h.text,
      displayText,
      weightedScore,
      scores: evaluation.scores,
      critique: evaluation.critique,
      rewrite: evaluation.rewrite,
      compliance: evaluation.compliance,
      isTop3: false,
    };
  });

  // Sort descending by weightedScore
  ranked.sort((a, b) => b.weightedScore - a.weightedScore);

  // Assign ranks & top 3 flag
  return ranked.map((hook, index) => ({
    ...hook,
    rank: index + 1,
    isTop3: index < 3,
  }));
}

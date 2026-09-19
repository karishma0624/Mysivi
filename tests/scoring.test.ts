import { describe, it, expect } from 'vitest';
import { calculateWeightedScore, rankHooks, SCORING_WEIGHTS } from '../shared/scoring';
import { HookItem, HookEvaluation } from '../shared/types';

describe('Scoring & Ranking Engine', () => {
  it('correctly weights the 5 rubric criteria', () => {
    // Scroll-stop .30, Relatability .25, Curiosity .20, Clarity .15, Brand fit .10
    const scores = {
      scrollStop: 10,
      relatability: 10,
      curiosityGap: 10,
      clarity: 10,
      brandFit: 10,
    };
    expect(calculateWeightedScore(scores)).toBe(10);

    const partialScores = {
      scrollStop: 9.0, // 2.70
      relatability: 8.0, // 2.00
      curiosityGap: 7.0, // 1.40
      clarity: 6.0, // 0.90
      brandFit: 5.0, // 0.50
    };
    // Expected sum: 2.70 + 2.00 + 1.40 + 0.90 + 0.50 = 7.50
    expect(calculateWeightedScore(partialScores)).toBe(7.5);
  });

  it('verifies that weights sum to exactly 1.0', () => {
    const sum =
      SCORING_WEIGHTS.scrollStop +
      SCORING_WEIGHTS.relatability +
      SCORING_WEIGHTS.curiosityGap +
      SCORING_WEIGHTS.clarity +
      SCORING_WEIGHTS.brandFit;
    expect(sum).toBeCloseTo(1.0, 5);
  });

  it('ranks hooks in descending order of weighted score and identifies top 3', () => {
    const hooks: HookItem[] = [
      { id: 'h1', text: 'Hook One', angleIndex: 0 },
      { id: 'h2', text: 'Hook Two', angleIndex: 1 },
      { id: 'h3', text: 'Hook Three', angleIndex: 2 },
      { id: 'h4', text: 'Hook Four', angleIndex: 3 },
    ];

    const evals: HookEvaluation[] = [
      {
        hookId: 'h1',
        scores: { scrollStop: 6, relatability: 6, curiosityGap: 6, clarity: 6, brandFit: 6 },
        critique: 'Average',
        compliance: { isCompliant: true, flags: [], safeRewrite: null },
      },
      {
        hookId: 'h2',
        scores: { scrollStop: 9, relatability: 9, curiosityGap: 9, clarity: 9, brandFit: 9 },
        critique: 'Excellent',
        compliance: { isCompliant: true, flags: [], safeRewrite: null },
      },
      {
        hookId: 'h3',
        scores: { scrollStop: 8, relatability: 8, curiosityGap: 8, clarity: 8, brandFit: 8 },
        critique: 'Very good',
        compliance: { isCompliant: true, flags: [], safeRewrite: null },
      },
      {
        hookId: 'h4',
        scores: { scrollStop: 7, relatability: 7, curiosityGap: 7, clarity: 7, brandFit: 7 },
        critique: 'Good',
        compliance: { isCompliant: true, flags: [], safeRewrite: null },
      },
    ];

    const ranked = rankHooks(hooks, evals);

    expect(ranked[0].hookId).toBe('h2');
    expect(ranked[0].rank).toBe(1);
    expect(ranked[0].isTop3).toBe(true);

    expect(ranked[1].hookId).toBe('h3');
    expect(ranked[1].rank).toBe(2);
    expect(ranked[1].isTop3).toBe(true);

    expect(ranked[2].hookId).toBe('h4');
    expect(ranked[2].rank).toBe(3);
    expect(ranked[2].isTop3).toBe(true);

    expect(ranked[3].hookId).toBe('h1');
    expect(ranked[3].rank).toBe(4);
    expect(ranked[3].isTop3).toBe(false);
  });

  it('substitutes displayText with safeRewrite when compliance flag exists', () => {
    const hooks: HookItem[] = [
      { id: 'bad_hook', text: 'You will be fluent in 10 days guaranteed.', angleIndex: 0 },
    ];
    const evals: HookEvaluation[] = [
      {
        hookId: 'bad_hook',
        scores: { scrollStop: 8, relatability: 8, curiosityGap: 8, clarity: 8, brandFit: 4 },
        critique: 'Violates guarantee rule',
        compliance: {
          isCompliant: false,
          flags: ['GUARANTEE_VIOLATION'],
          safeRewrite: 'Speak English with Arya for 5 minutes every day.',
        },
      },
    ];

    const ranked = rankHooks(hooks, evals);
    expect(ranked[0].displayText).toBe('Speak English with Arya for 5 minutes every day.');
    expect(ranked[0].rawText).toBe('You will be fluent in 10 days guaranteed.');
    expect(ranked[0].compliance.isCompliant).toBe(false);
  });
});

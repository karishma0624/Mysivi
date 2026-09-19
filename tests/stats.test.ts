import { describe, it, expect } from 'vitest';
import {
  twoProportionZTest,
  analyzeCampaignVariants,
  calculateBudgetPlan,
  normalCdf,
} from '../src/lib/stats';

describe('Statistical Engine — Two-Proportion Z-Test & Metrics', () => {
  it('approximates standard normal CDF accurately', () => {
    // Standard normal distribution benchmarks
    expect(normalCdf(0)).toBeCloseTo(0.5, 2);
    expect(normalCdf(1.96)).toBeCloseTo(0.975, 2);
    expect(normalCdf(-1.96)).toBeCloseTo(0.025, 2);
  });

  it('calculates z-score and two-tailed p-value for distinct proportions', () => {
    // Control: 400 clicks from 10,000 impressions (4.0%)
    // Variant: 550 clicks from 10,000 impressions (5.5%)
    const result = twoProportionZTest(400, 10000, 550, 10000);
    expect(result).not.toBeNull();
    if (result) {
      expect(result.zScore).toBeGreaterThan(4.5);
      expect(result.pValue).toBeLessThan(0.001); // Highly statistically significant
    }
  });

  it('returns pValue = 1 when proportions are identical', () => {
    const result = twoProportionZTest(100, 2000, 100, 2000);
    expect(result).not.toBeNull();
    if (result) {
      expect(result.zScore).toBe(0);
      expect(result.pValue).toBe(1);
    }
  });

  it('handles boundary conditions gracefully', () => {
    expect(twoProportionZTest(0, 0, 10, 100)).toBeNull();
    expect(twoProportionZTest(-5, 100, 10, 100)).toBeNull();
    expect(twoProportionZTest(150, 100, 10, 100)).toBeNull();
  });

  it('analyzes campaign variants and delivers correct verdicts', () => {
    const variants = [
      { id: 'ctrl', name: 'Control', isControl: true, impressions: 15000, clicks: 450, installs: 120, spend: 4500 },
      { id: 'win', name: 'Winner B', impressions: 16000, clicks: 700, installs: 230, spend: 5400 },
      { id: 'low', name: 'Low Sample', impressions: 400, clicks: 12, installs: 2, spend: 200 },
      { id: 'bad', name: 'Underperformer', impressions: 10000, clicks: 200, installs: 25, spend: 2500 },
    ];

    const results = analyzeCampaignVariants(variants, 35);
    expect(results.length).toBe(4);

    const winner = results.find((r) => r.id === 'win');
    expect(winner?.verdict).toBe('SCALE');
    expect(winner?.cpi).toBeLessThan(25);

    const lowSample = results.find((r) => r.id === 'low');
    expect(lowSample?.verdict).toBe('KEEP TESTING');
    expect(lowSample?.isSampleSufficient).toBe(false);

    const badVariant = results.find((r) => r.id === 'bad');
    expect(badVariant?.verdict).toBe('KILL');
  });

  it('calculates explore and exploit budget allocations properly', () => {
    const dailyBudget = 5000;
    const targetCpi = 35;
    const plan = calculateBudgetPlan(dailyBudget, targetCpi, 4);

    expect(plan.minTestBudgetPerVariant).toBe(35 * 15); // 525
    expect(plan.totalExploreBudgetNeeded).toBe(525 * 4); // 2100
    expect(plan.daysToCompleteExplore).toBeGreaterThanOrEqual(1);

    // Exploit: 70 / 20 / 10 split
    expect(plan.exploitAllocations[0].sharePercent).toBe(70);
    expect(plan.exploitAllocations[1].sharePercent).toBe(20);
    expect(plan.exploitAllocations[2].sharePercent).toBe(10);
  });
});

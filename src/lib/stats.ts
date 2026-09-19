/**
 * Statistical Engine for Growth Lab Ad Experimentation
 * Deterministic calculation of CTR, Install Rate, CPI, and Two-Proportion Z-Tests.
 * The LLM NEVER calculates these numbers; this engine is the single mathematical source of truth.
 */

export interface CampaignVariantMetrics {
  id: string;
  name: string;
  isControl?: boolean;
  impressions: number;
  clicks: number;
  installs: number;
  spend: number;
}

export interface ComputedVariantStats extends CampaignVariantMetrics {
  ctr: number; // percentage, e.g. 3.45%
  installRate: number; // percentage, e.g. 24.5%
  cpi: number; // INR, e.g. 32.50
  costPerClick: number; // INR
  isSampleSufficient: boolean;
  sampleWarning?: string;
  zScoreCtr: number | null;
  pValueCtr: number | null;
  zScoreInstallRate: number | null;
  pValueInstallRate: number | null;
  isCtrSignificant: boolean;
  isInstallRateSignificant: boolean;
  verdict: 'SCALE' | 'KEEP TESTING' | 'KILL';
  verdictReason: string;
}

export const STATS_THRESHOLDS = {
  MIN_IMPRESSIONS: 1000,
  MIN_CLICKS: 30,
  MIN_INSTALLS: 10,
  ALPHA_SIGNIFICANCE: 0.05, // 95% confidence level
  Z_CRITICAL_95: 1.96,
} as const;

/**
 * Standard Normal Cumulative Distribution Function approximation (Abramowitz and Stegun)
 */
export function normalCdf(z: number): number {
  const b1 = 0.319381530;
  const b2 = -0.356563782;
  const b3 = 1.781477937;
  const b4 = -1.821255978;
  const b5 = 1.330274429;
  const p = 0.2316419;
  const c = 0.39894228;

  if (z >= 0) {
    const t = 1.0 / (1.0 + p * z);
    return 1.0 - c * Math.exp(-z * z / 2.0) * t *
      (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1);
  } else {
    const t = 1.0 / (1.0 - p * z);
    return c * Math.exp(-z * z / 2.0) * t *
      (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1);
  }
}

/**
 * Calculates two-tailed p-value from z-score
 */
export function pValueFromZ(z: number): number {
  const absZ = Math.abs(z);
  return Math.min(1, Math.max(0, 2 * (1 - normalCdf(absZ))));
}

/**
 * Two-proportion z-test
 * Tests if proportion p2 (variant) is statistically different from p1 (control).
 * returns { zScore, pValue } or null if invalid inputs.
 */
export function twoProportionZTest(
  success1: number,
  trials1: number,
  success2: number,
  trials2: number
): { zScore: number; pValue: number } | null {
  if (trials1 <= 0 || trials2 <= 0) return null;
  if (success1 < 0 || success2 < 0) return null;
  if (success1 > trials1 || success2 > trials2) return null;

  const p1 = success1 / trials1;
  const p2 = success2 / trials2;

  // Pooled proportion
  const pooledP = (success1 + success2) / (trials1 + trials2);

  // If pooled proportion is 0 or 1, variance is 0
  if (pooledP <= 0 || pooledP >= 1) {
    return { zScore: 0, pValue: 1 };
  }

  const standardError = Math.sqrt(
    pooledP * (1 - pooledP) * (1 / trials1 + 1 / trials2)
  );

  if (standardError === 0) {
    return { zScore: 0, pValue: 1 };
  }

  const zScore = (p2 - p1) / standardError;
  const pValue = pValueFromZ(zScore);

  return {
    zScore: Math.round(zScore * 100) / 100,
    pValue: Math.round(pValue * 1000) / 1000,
  };
}

/**
 * Analyzes a full matrix of campaign variants against the designated control.
 */
export function analyzeCampaignVariants(
  variants: CampaignVariantMetrics[],
  targetCpi: number = 35
): ComputedVariantStats[] {
  const control = variants.find((v) => v.isControl) || variants[0];
  const controlInstalls = control?.installs || 1;
  const controlSpend = control?.spend || 0;

  const controlCpi = controlInstalls > 0 ? controlSpend / controlInstalls : 0;

  return variants.map((variant) => {
    const isControl = variant.id === control?.id;
    const ctr = variant.impressions > 0 ? (variant.clicks / variant.impressions) * 100 : 0;
    const installRate = variant.clicks > 0 ? (variant.installs / variant.clicks) * 100 : 0;
    const cpi = variant.installs > 0 ? variant.spend / variant.installs : variant.spend;
    const cpc = variant.clicks > 0 ? variant.spend / variant.clicks : 0;

    const isSampleSufficient =
      variant.impressions >= STATS_THRESHOLDS.MIN_IMPRESSIONS &&
      variant.clicks >= STATS_THRESHOLDS.MIN_CLICKS;

    let sampleWarning: string | undefined;
    if (variant.impressions < STATS_THRESHOLDS.MIN_IMPRESSIONS) {
      sampleWarning = `Low impressions (${variant.impressions.toLocaleString()} < 1,000 threshold)`;
    } else if (variant.clicks < STATS_THRESHOLDS.MIN_CLICKS) {
      sampleWarning = `Low click volume (${variant.clicks} < 30 threshold)`;
    }

    // Z-tests vs control
    let zScoreCtr: number | null = null;
    let pValueCtr: number | null = null;
    let zScoreInstallRate: number | null = null;
    let pValueInstallRate: number | null = null;

    if (!isControl && control) {
      const ctrTest = twoProportionZTest(
        control.clicks,
        control.impressions,
        variant.clicks,
        variant.impressions
      );
      if (ctrTest) {
        zScoreCtr = ctrTest.zScore;
        pValueCtr = ctrTest.pValue;
      }

      const crTest = twoProportionZTest(
        control.installs,
        control.clicks,
        variant.installs,
        variant.clicks
      );
      if (crTest) {
        zScoreInstallRate = crTest.zScore;
        pValueInstallRate = crTest.pValue;
      }
    }

    const isCtrSignificant = pValueCtr !== null && pValueCtr < STATS_THRESHOLDS.ALPHA_SIGNIFICANCE;
    const isInstallRateSignificant =
      pValueInstallRate !== null && pValueInstallRate < STATS_THRESHOLDS.ALPHA_SIGNIFICANCE;

    // Decision Logic
    let verdict: 'SCALE' | 'KEEP TESTING' | 'KILL' = 'KEEP TESTING';
    let verdictReason = '';

    if (isControl) {
      verdict = 'KEEP TESTING';
      verdictReason = 'Baseline control variant used as statistical benchmark.';
    } else if (!isSampleSufficient) {
      verdict = 'KEEP TESTING';
      verdictReason = sampleWarning || 'Sample size not yet statistically adequate.';
    } else {
      // Evaluate based on CPI and significance
      const cpiImprovement = controlCpi > 0 ? (controlCpi - cpi) / controlCpi : 0;

      if (cpi <= targetCpi && (cpiImprovement >= 0.10 || (isCtrSignificant && (zScoreCtr ?? 0) > 0))) {
        verdict = 'SCALE';
        verdictReason = `Efficient CPI ₹${cpi.toFixed(2)} (Target ₹${targetCpi}) with ${
          isCtrSignificant ? `statistically significant CTR lift (p=${pValueCtr})` : 'strong conversion velocity'
        }.`;
      } else if (cpi > targetCpi * 1.35 || (isCtrSignificant && (zScoreCtr ?? 0) < -1.96 && cpi > controlCpi)) {
        verdict = 'KILL';
        verdictReason = `Unfavorable unit economics (CPI ₹${cpi.toFixed(2)} is 35%+ above target ₹${targetCpi}). Reallocate budget.`;
      } else {
        verdict = 'KEEP TESTING';
        verdictReason = `Signal is promising (CPI ₹${cpi.toFixed(2)}), but p-value (${pValueCtr ?? 'N/A'}) requires more data to confirm significance.`;
      }
    }

    return {
      ...variant,
      isControl,
      ctr: Math.round(ctr * 100) / 100,
      installRate: Math.round(installRate * 100) / 100,
      cpi: Math.round(cpi * 100) / 100,
      costPerClick: Math.round(cpc * 100) / 100,
      isSampleSufficient,
      sampleWarning,
      zScoreCtr,
      pValueCtr,
      zScoreInstallRate,
      pValueInstallRate,
      isCtrSignificant,
      isInstallRateSignificant,
      verdict,
      verdictReason,
    };
  });
}

export interface BudgetAllocation {
  variantIndex: number;
  label: string;
  sharePercent: number;
  dailySpend: number;
  estimatedInstalls: number;
}

export interface BudgetPlanSummary {
  dailyBudget: number;
  targetCpi: number;
  variantCount: number;
  minTestBudgetPerVariant: number;
  totalExploreBudgetNeeded: number;
  daysToCompleteExplore: number;
  exploreAllocations: BudgetAllocation[];
  exploitAllocations: BudgetAllocation[];
  rulesExplanation: string[];
}

/**
 * Calculates Explore / Exploit Budget Distribution
 * Explore: Equal distribution until each variant achieves (target CPI * 15 installs)
 * Exploit: 70% to top variant, 20% to second, 10% to third.
 */
export function calculateBudgetPlan(
  dailyBudget: number,
  targetCpi: number,
  variantCount: number = 4
): BudgetPlanSummary {
  const minInstallsPerVariant = 15;
  const minTestBudgetPerVariant = targetCpi * minInstallsPerVariant;
  const totalExploreBudgetNeeded = minTestBudgetPerVariant * variantCount;
  const daysToCompleteExplore = Math.max(
    1,
    Math.ceil(totalExploreBudgetNeeded / Math.max(100, dailyBudget))
  );

  // Explore: Equal split
  const exploreShare = Math.round((100 / variantCount) * 10) / 10;
  const exploreDailyPerVariant = dailyBudget / variantCount;
  const exploreAllocations: BudgetAllocation[] = Array.from(
    { length: variantCount },
    (_, i) => ({
      variantIndex: i,
      label: i === 0 ? 'Control' : `Variant ${String.fromCharCode(65 + i - 1)}`,
      sharePercent: exploreShare,
      dailySpend: Math.round(exploreDailyPerVariant),
      estimatedInstalls: Math.round((exploreDailyPerVariant / targetCpi) * 10) / 10,
    })
  );

  // Exploit: 70/20/10 split across top 3
  const exploitSplits = [70, 20, 10];
  const exploitAllocations: BudgetAllocation[] = Array.from(
    { length: variantCount },
    (_, i) => {
      const share = i < 3 ? exploitSplits[i] : 0;
      const spend = (dailyBudget * share) / 100;
      return {
        variantIndex: i,
        label: i === 0 ? 'Winner (Variant B)' : i === 1 ? 'Runner-up (Control)' : i === 2 ? 'Variant A' : 'Variant C (Paused)',
        sharePercent: share,
        dailySpend: Math.round(spend),
        estimatedInstalls: Math.round((spend / targetCpi) * 10) / 10,
      };
    }
  );

  const rulesExplanation = [
    `Minimum statistical power threshold: 15 installs per variant (₹${minTestBudgetPerVariant} test budget each).`,
    `Explore phase: Equal distribution across all ${variantCount} variants until ₹${totalExploreBudgetNeeded.toLocaleString()} total test spend is satisfied (~${daysToCompleteExplore} days at ₹${dailyBudget.toLocaleString()}/day).`,
    `Exploit phase: 70% of spend reallocated to the top statistically verified winner, 20% to runner-up, 10% to challenger, pausing underperformers.`,
  ];

  return {
    dailyBudget,
    targetCpi,
    variantCount,
    minTestBudgetPerVariant,
    totalExploreBudgetNeeded,
    daysToCompleteExplore,
    exploreAllocations,
    exploitAllocations,
    rulesExplanation,
  };
}


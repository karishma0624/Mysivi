import { describe, it, expect } from 'vitest';
import {
  PainPointInputSchema,
  StudioIdeateOutputSchema,
  StudioEvaluateOutputSchema,
  StudioScriptsOutputSchema,
  StudioMediaPlanOutputSchema,
  AdsGenerateOutputSchema,
  ViralPlanOutputSchema,
} from '../shared/schemas';
import {
  SAMPLE_STUDIO_INPUT,
  SAMPLE_IDEATE_OUTPUT,
  SAMPLE_EVALUATE_OUTPUT,
  SAMPLE_SCRIPTS_OUTPUT,
  SAMPLE_MEDIA_PLAN_OUTPUT,
} from '../src/data/samples/studio.sample';
import { SAMPLE_AD_VARIANTS } from '../src/data/samples/ads.sample';
import { SAMPLE_VIRAL_PLAN } from '../src/data/samples/viral.sample';

describe('Zod Schema Validation & Data Contracts', () => {
  it('validates PainPointInputSchema with sample input', () => {
    const parsed = PainPointInputSchema.safeParse(SAMPLE_STUDIO_INPUT);
    expect(parsed.success).toBe(true);
  });

  it('rejects pain points under 5 chars or over 200 chars', () => {
    expect(
      PainPointInputSchema.safeParse({ ...SAMPLE_STUDIO_INPUT, painPoint: 'No' }).success
    ).toBe(false);

    expect(
      PainPointInputSchema.safeParse({
        ...SAMPLE_STUDIO_INPUT,
        painPoint: 'a'.repeat(205),
      }).success
    ).toBe(false);
  });

  it('validates StudioIdeateOutputSchema with exactly 4 angles and 15 hooks', () => {
    const parsed = StudioIdeateOutputSchema.safeParse(SAMPLE_IDEATE_OUTPUT);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.angles.length).toBe(4);
      expect(parsed.data.hooks.length).toBe(15);
    }
  });

  it('validates StudioEvaluateOutputSchema with 15 evaluations', () => {
    const parsed = StudioEvaluateOutputSchema.safeParse(SAMPLE_EVALUATE_OUTPUT);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.evaluations.length).toBe(15);
    }
  });

  it('validates StudioScriptsOutputSchema with 3 scripts and 4 beats each', () => {
    const parsed = StudioScriptsOutputSchema.safeParse(SAMPLE_SCRIPTS_OUTPUT);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.scripts.length).toBe(3);
      parsed.data.scripts.forEach((s) => {
        expect(s.beats.length).toBe(4);
      });
    }
  });

  it('validates StudioMediaPlanOutputSchema with 4 frames and 4 video prompts', () => {
    const parsed = StudioMediaPlanOutputSchema.safeParse(SAMPLE_MEDIA_PLAN_OUTPUT);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.storyboardFrames.length).toBe(4);
      expect(parsed.data.videoPrompts.length).toBe(4);
    }
  });

  it('validates AdsGenerateOutputSchema', () => {
    const parsed = AdsGenerateOutputSchema.safeParse({ variants: SAMPLE_AD_VARIANTS });
    expect(parsed.success).toBe(true);
  });

  it('validates ViralPlanOutputSchema', () => {
    const parsed = ViralPlanOutputSchema.safeParse(SAMPLE_VIRAL_PLAN);
    expect(parsed.success).toBe(true);
  });
});

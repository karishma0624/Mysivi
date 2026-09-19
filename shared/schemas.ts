import { z } from 'zod';

export const AudienceEnum = z.enum([
  'Job seekers',
  'Students',
  'Working professionals',
  'Homemakers',
]);

export const SupportedLanguageEnum = z.enum([
  'English',
  'Hinglish',
  'Tanglish',
  'Hindi',
  'Tamil',
  'Telugu',
  'Kannada',
]);

export const PlatformEnum = z.enum([
  'Instagram Reel',
  'YouTube Short',
  'Meta ad',
]);

export const ToneEnum = z.enum([
  'Relatable',
  'Funny',
  'Emotional',
  'Bold',
]);

// 1. Studio Input
export const PainPointInputSchema = z.object({
  painPoint: z.string().min(5).max(200),
  audience: AudienceEnum,
  language: SupportedLanguageEnum,
  platform: PlatformEnum,
  tone: ToneEnum,
});

// 2. Studio Ideate (Strategist + Hook Writer)
export const HookItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  angleIndex: z.number(),
});

export const StudioIdeateOutputSchema = z.object({
  insight: z.string(),
  angles: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
    })
  ).length(4),
  hooks: z.array(HookItemSchema).length(15),
});

// 3. Studio Evaluate (Critic + Compliance Guard)
export const HookScoreRubricSchema = z.object({
  scrollStop: z.number().min(0).max(10),
  relatability: z.number().min(0).max(10),
  clarity: z.number().min(0).max(10),
  curiosityGap: z.number().min(0).max(10),
  brandFit: z.number().min(0).max(10),
});

export const HookEvaluationSchema = z.object({
  hookId: z.string(),
  scores: HookScoreRubricSchema,
  critique: z.string(),
  rewrite: z.string().nullable().optional(),
  compliance: z.object({
    isCompliant: z.boolean(),
    flags: z.array(z.string()),
    safeRewrite: z.string().nullable(),
  }),
});

export const StudioEvaluateOutputSchema = z.object({
  evaluations: z.array(HookEvaluationSchema).length(15),
});

// 4. Studio Scripts (Script Director)
export const ScriptBeatSchema = z.object({
  timecode: z.string(),
  name: z.string(),
  voiceover: z.string(),
  caption: z.string(),
  visual: z.string(),
  audioVibe: z.string(),
});

export const ScriptItemSchema = z.object({
  hookId: z.string(),
  hookText: z.string(),
  durationSeconds: z.number(),
  beats: z.array(ScriptBeatSchema).length(4),
  cta: z.string(),
});

export const StudioScriptsOutputSchema = z.object({
  scripts: z.array(ScriptItemSchema).length(3),
});

// 5. Studio Media Plan (Visual Director + Video Prompt Writer)
export const StoryboardFrameSchema = z.object({
  frameIndex: z.number(),
  timecode: z.string(),
  sceneDescription: z.string(),
  imagePrompt: z.string(),
  altText: z.string(),
  fallbackSvgId: z.enum([
    'interview_freeze',
    'mirror_practice',
    'arya_call',
    'speaking_breakthrough',
  ]),
});

export const VideoShotPromptSchema = z.object({
  shot: z.string(),
  camera: z.string(),
  lighting: z.string(),
  motion: z.string(),
  duration: z.string(),
  prompt: z.string(),
  negativePrompt: z.string(),
});

export const StudioMediaPlanOutputSchema = z.object({
  storyboardFrames: z.array(StoryboardFrameSchema).length(4),
  videoPrompts: z.array(VideoShotPromptSchema).length(4),
});

// 6. Storyboard Frame Generation
export const StoryboardGenerateInputSchema = z.object({
  frameIndex: z.number().min(1).max(4),
  imagePrompt: z.string(),
  fallbackSvgId: z.string(),
});

export const StoryboardGenerateOutputSchema = z.object({
  frameIndex: z.number(),
  imageUrl: z.string().nullable(),
  isGenerated: z.boolean(),
  label: z.enum(['AI-generated', 'Illustrated fallback']),
  description: z.string(),
});

// 7. Ads Generate (Variant Matrix)
export const AdVariantSchema = z.object({
  id: z.string(),
  variantName: z.string(),
  hook: z.string(),
  angle: z.string(),
  audience: z.string(),
  primaryText: z.string(),
  headline: z.string(),
  description: z.string(),
  ctaType: z.string(),
});

export const AdsGenerateOutputSchema = z.object({
  variants: z.array(AdVariantSchema).min(3).max(6),
});

// 8. Ads Explain (LLM converts TS stats into plain English)
export const AdsExplainInputSchema = z.object({
  variantId: z.string(),
  variantName: z.string(),
  impressions: z.number(),
  clicks: z.number(),
  installs: z.number(),
  spend: z.number(),
  ctr: z.number(),
  cpi: z.number(),
  zScoreCtr: z.number().nullable(),
  pValueCtr: z.number().nullable(),
  zScoreCpi: z.number().nullable(),
  verdict: z.enum(['SCALE', 'KEEP TESTING', 'KILL']),
});

export const AdsExplainOutputSchema = z.object({
  variantId: z.string(),
  verdict: z.enum(['SCALE', 'KEEP TESTING', 'KILL']),
  plainEnglishVerdict: z.string(),
  statisticalInsight: z.string(),
  whatToTestNext: z.string(),
});

// 9. Viral Plan (Trend Adapter + Calendar + Brief + Checklist)
export const ViralPlanInputSchema = z.object({
  trendDescription: z.string().min(3).max(300),
  language: SupportedLanguageEnum,
  audience: AudienceEnum,
  goal: z.string().optional(),
});

export const TrendAdaptationSchema = z.object({
  originalFormat: z.string(),
  mysiviAdaptation: z.string(),
  hook: z.string(),
  beats: z.array(z.string()).length(4),
  cta: z.string(),
});

export const CalendarItemSchema = z.object({
  day: z.number(),
  dayName: z.string(),
  format: z.enum(['Reel', 'Carousel', 'Community Post']),
  pillar: z.string(),
  topic: z.string(),
  hookOrHeadline: z.string(),
  firstCommentPrompt: z.string(),
});

export const CreatorBriefSchema = z.object({
  title: z.string(),
  creatorPersona: z.string(),
  deliverables: z.string(),
  dos: z.array(z.string()),
  donts: z.array(z.string()),
  brandVoiceNotes: z.string(),
});

export const ViralityChecklistItemSchema = z.object({
  criterion: z.string(),
  score: z.number().min(0).max(10),
  heuristicReasoning: z.string(),
  improvementTip: z.string(),
});

export const ViralPlanOutputSchema = z.object({
  trendDescription: z.string(),
  trendAdaptations: z.array(TrendAdaptationSchema).length(3),
  calendar: z.array(CalendarItemSchema).length(7),
  creatorBriefs: z.array(CreatorBriefSchema).length(2),
  viralityChecklist: z.array(ViralityChecklistItemSchema).length(4),
});

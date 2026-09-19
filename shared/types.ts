import { z } from 'zod';
import {
  PainPointInputSchema,
  HookItemSchema,
  StudioIdeateOutputSchema,
  HookScoreRubricSchema,
  HookEvaluationSchema,
  StudioEvaluateOutputSchema,
  ScriptBeatSchema,
  ScriptItemSchema,
  StudioScriptsOutputSchema,
  StoryboardFrameSchema,
  VideoShotPromptSchema,
  StudioMediaPlanOutputSchema,
  StoryboardGenerateInputSchema,
  StoryboardGenerateOutputSchema,
  AdVariantSchema,
  AdsGenerateOutputSchema,
  AdsExplainInputSchema,
  AdsExplainOutputSchema,
  ViralPlanInputSchema,
  TrendAdaptationSchema,
  CalendarItemSchema,
  CreatorBriefSchema,
  ViralityChecklistItemSchema,
  ViralPlanOutputSchema,
  AudienceEnum,
  SupportedLanguageEnum,
  PlatformEnum,
  ToneEnum,
} from './schemas';

export type Audience = z.infer<typeof AudienceEnum>;
export type SupportedLanguage = z.infer<typeof SupportedLanguageEnum>;
export type Platform = z.infer<typeof PlatformEnum>;
export type Tone = z.infer<typeof ToneEnum>;

export type PainPointInput = z.infer<typeof PainPointInputSchema>;
export type HookItem = z.infer<typeof HookItemSchema>;
export type StudioIdeateOutput = z.infer<typeof StudioIdeateOutputSchema>;

export type HookScoreRubric = z.infer<typeof HookScoreRubricSchema>;
export type HookEvaluation = z.infer<typeof HookEvaluationSchema>;
export type StudioEvaluateOutput = z.infer<typeof StudioEvaluateOutputSchema>;

export interface RankedHook {
  hookId: string;
  rank: number;
  rawText: string;
  displayText: string;
  weightedScore: number;
  scores: HookScoreRubric;
  critique: string;
  rewrite?: string | null;
  compliance: {
    isCompliant: boolean;
    flags: string[];
    safeRewrite: string | null;
  };
  isTop3: boolean;
}

export type ScriptBeat = z.infer<typeof ScriptBeatSchema>;
export type ScriptItem = z.infer<typeof ScriptItemSchema>;
export type StudioScriptsOutput = z.infer<typeof StudioScriptsOutputSchema>;

export type StoryboardFrame = z.infer<typeof StoryboardFrameSchema>;
export type VideoShotPrompt = z.infer<typeof VideoShotPromptSchema>;
export type StudioMediaPlanOutput = z.infer<typeof StudioMediaPlanOutputSchema>;

export type StoryboardGenerateInput = z.infer<typeof StoryboardGenerateInputSchema>;
export type StoryboardGenerateOutput = z.infer<typeof StoryboardGenerateOutputSchema>;

export type AdVariant = z.infer<typeof AdVariantSchema>;
export type AdsGenerateOutput = z.infer<typeof AdsGenerateOutputSchema>;
export type AdsExplainInput = z.infer<typeof AdsExplainInputSchema>;
export type AdsExplainOutput = z.infer<typeof AdsExplainOutputSchema>;

export type ViralPlanInput = z.infer<typeof ViralPlanInputSchema>;
export type TrendAdaptation = z.infer<typeof TrendAdaptationSchema>;
export type CalendarItem = z.infer<typeof CalendarItemSchema>;
export type CreatorBrief = z.infer<typeof CreatorBriefSchema>;
export type ViralityChecklistItem = z.infer<typeof ViralityChecklistItemSchema>;
export type ViralPlanOutput = z.infer<typeof ViralPlanOutputSchema>;

// Agent pipeline stages
export type AgentStageId =
  | 'strategist'
  | 'hookWriter'
  | 'critic'
  | 'complianceGuard'
  | 'ranker'
  | 'scriptDirector'
  | 'visualDirector'
  | 'videoPromptWriter';

export type AgentStatus = 'idle' | 'working' | 'done' | 'failed';

export interface AgentStageState {
  id: AgentStageId;
  name: string;
  role: string;
  status: AgentStatus;
  outputPreview?: string;
  timeMs?: number;
}

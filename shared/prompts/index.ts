import { strategistPrompt } from './strategist';
import { hookWriterPrompt } from './hookWriter';
import { criticPrompt } from './critic';
import { complianceGuardPrompt } from './complianceGuard';
import { scriptDirectorPrompt } from './scriptDirector';
import { visualDirectorPrompt } from './visualDirector';
import { videoPromptWriterPrompt } from './videoPromptWriter';
import { adVariantWriterPrompt } from './adVariantWriter';
import { adExplainerPrompt } from './adExplainer';
import { trendAdapterPrompt } from './trendAdapter';
import { calendarPlannerPrompt } from './calendarPlanner';
import { creatorBriefPrompt } from './creatorBrief';
import { viralityChecklistPrompt } from './viralityChecklist';

export interface PromptDefinition {
  id: string;
  name: string;
  designNote: string;
  system: string;
  userTemplate: string;
  schema: unknown;
  fewShot: {
    input: unknown;
    output: unknown;
  };
}

export const ALL_PROMPTS: PromptDefinition[] = [
  strategistPrompt,
  hookWriterPrompt,
  criticPrompt,
  complianceGuardPrompt,
  scriptDirectorPrompt,
  visualDirectorPrompt,
  videoPromptWriterPrompt,
  adVariantWriterPrompt,
  adExplainerPrompt,
  trendAdapterPrompt,
  calendarPlannerPrompt,
  creatorBriefPrompt,
  viralityChecklistPrompt,
];

export const PROMPTS_BY_ID = ALL_PROMPTS.reduce((acc, p) => {
  acc[p.id] = p;
  return acc;
}, {} as Record<string, PromptDefinition>);

export {
  strategistPrompt,
  hookWriterPrompt,
  criticPrompt,
  complianceGuardPrompt,
  scriptDirectorPrompt,
  visualDirectorPrompt,
  videoPromptWriterPrompt,
  adVariantWriterPrompt,
  adExplainerPrompt,
  trendAdapterPrompt,
  calendarPlannerPrompt,
  creatorBriefPrompt,
  viralityChecklistPrompt,
};

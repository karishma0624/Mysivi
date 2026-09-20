import { useState, useCallback } from 'react';
import {
  PainPointInput,
  StudioIdeateOutput,
  StudioEvaluateOutput,
  RankedHook,
  StudioScriptsOutput,
  StudioMediaPlanOutput,
  AgentStageState,
  AgentStageId,
} from '@shared/types';
import { rankHooks } from '@shared/scoring';
import {
  SAMPLE_STUDIO_INPUT,
  SAMPLE_IDEATE_OUTPUT,
  SAMPLE_EVALUATE_OUTPUT,
  SAMPLE_RANKED_HOOKS,
  SAMPLE_SCRIPTS_OUTPUT,
  SAMPLE_MEDIA_PLAN_OUTPUT,
} from '@/data/samples/studio.sample';
import { api } from '@/lib/api';

const INITIAL_STAGES: AgentStageState[] = [
  { id: 'strategist', name: 'Strategist', role: 'Psychological Insight', status: 'idle' },
  { id: 'hookWriter', name: 'Hook Writer', role: '15 Spoken Hooks', status: 'idle' },
  { id: 'critic', name: 'Creative Critic', role: '5-Pillar Rubric Scoring', status: 'idle' },
  { id: 'complianceGuard', name: 'Compliance Guard', role: 'Brand & Safety Audit', status: 'idle' },
  { id: 'ranker', name: 'Algorithmic Ranker', role: 'Weighted Optimization', status: 'idle' },
  { id: 'scriptDirector', name: 'Script Director', role: '15s Timed Narrative Beats', status: 'idle' },
  { id: 'visualDirector', name: 'Visual Director', role: '9:16 Vertical Storyboard', status: 'idle' },
  { id: 'videoPromptWriter', name: 'Video Prompt Engineer', role: 'Veo / Runway Prompts', status: 'idle' },
];

export function useStudioPipeline() {
  const [input, setInput] = useState<PainPointInput>(SAMPLE_STUDIO_INPUT);
  const [stages, setStages] = useState<AgentStageState[]>(INITIAL_STAGES);
  const [currentStageId, setCurrentStageId] = useState<AgentStageId | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSampleRun, setIsSampleRun] = useState(true);

  // Pipeline Data Results
  const [ideateData, setIdeateData] = useState<StudioIdeateOutput>(SAMPLE_IDEATE_OUTPUT);
  const [evaluateData, setEvaluateData] = useState<StudioEvaluateOutput>(SAMPLE_EVALUATE_OUTPUT);
  const [rankedHooks, setRankedHooks] = useState<RankedHook[]>(SAMPLE_RANKED_HOOKS);
  const [scriptsData, setScriptsData] = useState<StudioScriptsOutput>(SAMPLE_SCRIPTS_OUTPUT);
  const [mediaPlanData, setMediaPlanData] = useState<StudioMediaPlanOutput>(SAMPLE_MEDIA_PLAN_OUTPUT);
  const [selectedScriptIndex, setSelectedScriptIndex] = useState(0);

  const updateStage = (
    id: AgentStageId,
    status: AgentStageState['status'],
    outputPreview?: string,
    timeMs?: number
  ) => {
    setStages((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status, outputPreview: outputPreview ?? s.outputPreview, timeMs } : s))
    );
  };

  const runPipeline = useCallback(async (newInput: PainPointInput) => {
    setInput(newInput);
    setIsLoading(true);
    setIsSampleRun(false);

    // Reset stages
    setStages(INITIAL_STAGES);

    // -------------------------------------------------------------
    // CALL 1: Strategist + Hook Writer (/api/studio/ideate)
    // -------------------------------------------------------------
    setCurrentStageId('strategist');
    updateStage('strategist', 'working');
    const t0 = performance.now();

    const ideateRes = await api.ideate(newInput);
    const t1 = performance.now();

    if (ideateRes.isSample) {
      setIsSampleRun(true);
    }

    const currentIdeate = ideateRes.data;
    setIdeateData(currentIdeate);

    updateStage('strategist', 'done', currentIdeate.insight.slice(0, 75) + '...', Math.round(t1 - t0));

    // Hook Writer stage
    setCurrentStageId('hookWriter');
    updateStage('hookWriter', 'working');
    const t2 = performance.now();
    await new Promise((r) => setTimeout(r, 400)); // Smooth UX transition
    const t3 = performance.now();
    updateStage('hookWriter', 'done', `${currentIdeate.hooks.length} spoken hooks generated across 4 angles`, Math.round(t3 - t2));

    // -------------------------------------------------------------
    // CALL 2: Critic + Compliance Guard (/api/studio/evaluate)
    // -------------------------------------------------------------
    setCurrentStageId('critic');
    updateStage('critic', 'working');
    const t4 = performance.now();

    const evaluateRes = await api.evaluate({
      hooks: currentIdeate.hooks,
      audience: newInput.audience,
      platform: newInput.platform,
      language: newInput.language,
    });
    const t5 = performance.now();

    const currentEvaluate = evaluateRes.data;
    setEvaluateData(currentEvaluate);
    updateStage('critic', 'done', 'All 15 hooks evaluated across 5 rubric criteria', Math.round(t5 - t4));

    // Compliance Guard stage
    setCurrentStageId('complianceGuard');
    updateStage('complianceGuard', 'working');
    const t6 = performance.now();
    await new Promise((r) => setTimeout(r, 350));
    const t7 = performance.now();
    const flaggedCount = currentEvaluate.evaluations.filter((e) => !e.compliance.isCompliant).length;
    updateStage(
      'complianceGuard',
      'done',
      flaggedCount > 0
        ? `${flaggedCount} policy violations corrected with safe rewrites`
        : 'All 15 hooks verified brand compliant',
      Math.round(t7 - t6)
    );

    // -------------------------------------------------------------
    // STAGE 3: Algorithmic Ranker (Pure TS in-code calculation)
    // -------------------------------------------------------------
    setCurrentStageId('ranker');
    updateStage('ranker', 'working');
    const t8 = performance.now();
    const ranked = rankHooks(currentIdeate.hooks, currentEvaluate.evaluations);
    setRankedHooks(ranked);
    const t9 = performance.now();
    updateStage(
      'ranker',
      'done',
      `Top 3 hooks selected (Top score: ${ranked[0]?.weightedScore.toFixed(1)}/10)`,
      Math.round(t9 - t8)
    );

    // -------------------------------------------------------------
    // CALL 3: Script Director (/api/studio/scripts)
    // -------------------------------------------------------------
    setCurrentStageId('scriptDirector');
    updateStage('scriptDirector', 'working');
    const t10 = performance.now();

    const top3 = ranked.slice(0, 3).map((h) => ({ id: h.hookId, text: h.displayText }));
    const scriptsRes = await api.generateScripts({
      topHooks: top3,
      language: newInput.language,
      audience: newInput.audience,
      tone: newInput.tone,
      platform: newInput.platform,
    });
    const t11 = performance.now();

    const currentScripts = scriptsRes.data;
    setScriptsData(currentScripts);
    updateStage(
      'scriptDirector',
      'done',
      `3 15-second scripts created with 4 timed beats each`,
      Math.round(t11 - t10)
    );

    // -------------------------------------------------------------
    // CALL 4: Visual Director + Video Prompt Writer (/api/studio/media-plan)
    // -------------------------------------------------------------
    setCurrentStageId('visualDirector');
    updateStage('visualDirector', 'working');
    const t12 = performance.now();

    const mediaRes = await api.generateMediaPlan({
      primaryScript: currentScripts.scripts[0],
    });
    const t13 = performance.now();

    const currentMedia = mediaRes.data;
    setMediaPlanData(currentMedia);
    updateStage(
      'visualDirector',
      'done',
      '4 vertical 9:16 storyboard frames mapped to SVG art',
      Math.round(t13 - t12)
    );

    // Video Prompt Writer
    setCurrentStageId('videoPromptWriter');
    updateStage('videoPromptWriter', 'working');
    const t14 = performance.now();
    await new Promise((r) => setTimeout(r, 300));
    const t15 = performance.now();
    updateStage(
      'videoPromptWriter',
      'done',
      '4 generative shot prompts ready for Veo/Runway',
      Math.round(t15 - t14)
    );

    setCurrentStageId(undefined);
    setIsLoading(false);
  }, []);

  const loadSampleRun = useCallback(() => {
    setInput(SAMPLE_STUDIO_INPUT);
    setIsSampleRun(true);
    setIsLoading(false);
    setIdeateData(SAMPLE_IDEATE_OUTPUT);
    setEvaluateData(SAMPLE_EVALUATE_OUTPUT);
    setRankedHooks(SAMPLE_RANKED_HOOKS);
    setScriptsData(SAMPLE_SCRIPTS_OUTPUT);
    setMediaPlanData(SAMPLE_MEDIA_PLAN_OUTPUT);
    setSelectedScriptIndex(0);

    // Populate all stages as done with simulated sample runtimes
    setStages([
      { id: 'strategist', name: 'Strategist', role: 'Psychological Insight', status: 'done', outputPreview: SAMPLE_IDEATE_OUTPUT.insight.slice(0, 75) + '...', timeMs: 480 },
      { id: 'hookWriter', name: 'Hook Writer', role: '15 Spoken Hooks', status: 'done', outputPreview: '15 spoken hooks generated across 4 angles', timeMs: 320 },
      { id: 'critic', name: 'Creative Critic', role: '5-Pillar Rubric Scoring', status: 'done', outputPreview: 'All 15 hooks evaluated across 5 rubric criteria', timeMs: 510 },
      { id: 'complianceGuard', name: 'Compliance Guard', role: 'Brand & Safety Audit', status: 'done', outputPreview: '1 policy violation corrected with safe rewrite', timeMs: 290 },
      { id: 'ranker', name: 'Algorithmic Ranker', role: 'Weighted Optimization', status: 'done', outputPreview: 'Top 3 hooks selected (Top score: 9.1/10)', timeMs: 12 },
      { id: 'scriptDirector', name: 'Script Director', role: '15s Timed Narrative Beats', status: 'done', outputPreview: '3 15-second scripts created with 4 timed beats each', timeMs: 640 },
      { id: 'visualDirector', name: 'Visual Director', role: '9:16 Vertical Storyboard', status: 'done', outputPreview: '4 vertical 9:16 storyboard frames mapped to SVG art', timeMs: 580 },
      { id: 'videoPromptWriter', name: 'Video Prompt Engineer', role: 'Veo / Runway Prompts', status: 'done', outputPreview: '4 generative shot prompts ready for Veo/Runway', timeMs: 220 },
    ]);
  }, []);

  return {
    input,
    stages,
    currentStageId,
    isLoading,
    isSampleRun,
    ideateData,
    evaluateData,
    rankedHooks,
    scriptsData,
    mediaPlanData,
    selectedScriptIndex,
    setSelectedScriptIndex,
    runPipeline,
    loadSampleRun,
  };
}

import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';
import { useStudioPipeline } from '@/hooks/useStudioPipeline';
import { PainPointForm } from '@/components/studio/PainPointForm';
import { AgentPipeline } from '@/components/studio/AgentPipeline';
import { HookBoard } from '@/components/studio/HookBoard';
import { ScriptTimeline } from '@/components/studio/ScriptTimeline';
import { StoryboardGrid } from '@/components/studio/StoryboardGrid';
import { ReelPhone } from '@/components/studio/ReelPhone';
import { VideoPromptPack } from '@/components/studio/VideoPromptPack';
import { ExportBar } from '@/components/studio/ExportBar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const Studio: React.FC = () => {
  const [searchParams] = useSearchParams();
  const {
    input,
    stages,
    currentStageId,
    isLoading,
    isSampleRun,
    rankedHooks,
    scriptsData,
    mediaPlanData,
    selectedScriptIndex,
    setSelectedScriptIndex,
    runPipeline,
    loadSampleRun,
  } = useStudioPipeline();

  // Handle URL query flags for fast demo start
  useEffect(() => {
    const isSampleParam = searchParams.get('sample');
    const isAutoRun = searchParams.get('autoRun');

    if (isAutoRun === 'true') {
      loadSampleRun();
    } else if (isSampleParam === 'true') {
      loadSampleRun();
    }
  }, [searchParams, loadSampleRun]);

  const primaryScript = scriptsData?.scripts[selectedScriptIndex] || scriptsData?.scripts[0];

  return (
    <div className="space-y-12">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ECE9F8] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6D4AFF] bg-lavender-100 px-2.5 py-0.5 rounded-full border border-[#DDD8F5]">
              MODULE 1 • CONTENT STUDIO
            </span>
            {isSampleRun ? <Badge kind="sample_run" /> : <Badge kind="ai_generated" text="Live Run" />}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Autonomous Content Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-body mt-1 max-w-2xl">
            Transforms learner anxiety into 15 evaluated hooks, 15-second beat scripts, photorealistic vertical storyboards, and an animated Reel preview.
          </p>
        </div>

        <button
          type="button"
          onClick={loadSampleRun}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#F0EEFF] text-[#6D4AFF] hover:bg-[#E6E2FF] border border-[#DDD8F5] transition-all self-start sm:self-auto shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reload Verified Sample Run</span>
        </button>
      </div>

      {/* 1. Pain Point Input Form */}
      <Card>
        <PainPointForm
          initialValues={input}
          onSubmit={runPipeline}
          isLoading={isLoading}
        />
      </Card>

      {/* 2. 8-Agent Autonomous Pipeline Visual Sequence */}
      <Card>
        <AgentPipeline stages={stages} currentStageId={currentStageId} />
      </Card>

      {/* 3. Hero Feature Split: Reel Phone Preview + Script Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: ReelPhone (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center sticky top-20">
          <ReelPhone
            script={primaryScript}
            storyboardFrames={mediaPlanData.storyboardFrames}
            language={input.language}
            autoPlay={true}
          />
        </div>

        {/* Right Column: Script Timeline (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <ScriptTimeline
            scripts={scriptsData.scripts}
            selectedScriptIndex={selectedScriptIndex}
            onSelectScriptIndex={setSelectedScriptIndex}
          />
        </div>
      </div>

      {/* 4. Ranked Hook Board (Top 3 elevated + 12 toggleable) */}
      <HookBoard
        hooks={rankedHooks}
        selectedHookId={primaryScript?.hookId}
        onSelectHookForScript={(hookId) => {
          const idx = scriptsData.scripts.findIndex((s) => s.hookId === hookId);
          if (idx !== -1) setSelectedScriptIndex(idx);
        }}
      />

      {/* 5. Vertical Storyboard Grid (AI generated or SVG scene fallback) */}
      <StoryboardGrid frames={mediaPlanData.storyboardFrames} />

      {/* 6. Text-to-Video Prompt Pack (Veo / Runway) */}
      <VideoPromptPack prompts={mediaPlanData.videoPrompts} />

      {/* 7. Ready To Ship Action Bar */}
      <ExportBar
        painPoint={input.painPoint}
        audience={input.audience}
        language={input.language}
        topHooks={rankedHooks}
        primaryScript={primaryScript}
        storyboard={mediaPlanData.storyboardFrames}
        videoPrompts={mediaPlanData.videoPrompts}
      />
    </div>
  );
};

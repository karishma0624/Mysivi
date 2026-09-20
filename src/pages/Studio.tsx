import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  RotateCcw,
  Zap,
  Cpu,
  Play,
  Terminal,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import clsx from 'clsx';
import { PainPointInput } from '@shared/types';
import { useStudioPipeline } from '@/hooks/useStudioPipeline';
import { useAgentStream } from '@/hooks/useAgentStream';
import { PainPointForm } from '@/components/studio/PainPointForm';
import { AgentPipeline } from '@/components/studio/AgentPipeline';
import { AgentGraph } from '@/components/studio/AgentGraph';
import { HumanSelectCard } from '@/components/studio/HumanSelectCard';
import { TraceDrawer } from '@/components/studio/TraceDrawer';
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
  const [pipelineMode, setPipelineMode] = useState<'agent' | 'quick'>('agent');
  const [isTraceDrawerOpen, setIsTraceDrawerOpen] = useState(false);

  // Quick mode pipeline hook (legacy stateless)
  const quick = useStudioPipeline();

  // Agent mode pipeline hook (LangGraph SSE)
  const agent = useAgentStream();

  // Fast demo flags from URL
  useEffect(() => {
    const isSampleParam = searchParams.get('sample');
    const isAutoRun = searchParams.get('autoRun');

    if (isAutoRun === 'true' || isSampleParam === 'true') {
      agent.replaySampleRun();
    }
  }, [searchParams]);

  // Determine active dataset based on mode
  const isAgentMode = pipelineMode === 'agent';
  const activeInput = isAgentMode ? quick.input : quick.input;
  const activeRankedHooks = isAgentMode ? agent.rankedHooks : quick.rankedHooks;
  const activeScriptsData = isAgentMode ? agent.scriptsData : quick.scriptsData;
  const activeMediaPlanData = isAgentMode ? agent.mediaPlanData : quick.mediaPlanData;
  const activeScriptIndex = isAgentMode ? agent.selectedScriptIndex : quick.selectedScriptIndex;
  const setActiveScriptIndex = isAgentMode ? agent.setSelectedScriptIndex : quick.setSelectedScriptIndex;
  const isCurrentlyLoading = isAgentMode ? (agent.isRunning || agent.isResuming) : quick.isLoading;

  const primaryScript =
    activeScriptsData?.scripts[activeScriptIndex] || activeScriptsData?.scripts[0];

  const handleFormSubmit = (newInput: PainPointInput) => {
    if (isAgentMode) {
      if (agent.agentHealth === 'offline') {
        agent.replaySampleRun();
        return;
      }
      agent.startRun(newInput);
    } else {
      quick.runPipeline(newInput);
    }
  };

  return (
    <div className="space-y-10">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ECE9F8] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6D4AFF] bg-lavender-100 px-2.5 py-0.5 rounded-full border border-[#DDD8F5]">
              MODULE 1 • CONTENT STUDIO
            </span>
            {isAgentMode ? (
              agent.isSampleReplay ? (
                <Badge kind="sample_run" text="Recorded Agent Run" />
              ) : (
                <Badge kind="ai_generated" text="LangGraph Agent" />
              )
            ) : quick.isSampleRun ? (
              <Badge kind="sample_run" />
            ) : (
              <Badge kind="ai_generated" text="Quick Mode" />
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            AI Agent Content Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-body mt-1 max-w-2xl">
            Transforms learner anxiety into 15 evaluated hooks, 15-second beat scripts, photorealistic vertical storyboards, and an animated Reel preview.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {isAgentMode ? (
            <button
              type="button"
              onClick={agent.replaySampleRun}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#F0EEFF] text-[#6D4AFF] hover:bg-[#E6E2FF] border border-[#DDD8F5] transition-all shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-[#6D4AFF]" />
              <span>Watch Recorded Live Run</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={quick.loadSampleRun}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#F0EEFF] text-[#6D4AFF] hover:bg-[#E6E2FF] border border-[#DDD8F5] transition-all shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reload Sample Run</span>
            </button>
          )}

          {isAgentMode && (
            <button
              type="button"
              onClick={() => setIsTraceDrawerOpen(!isTraceDrawerOpen)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-ink hover:bg-gray-50 border border-[#ECE9F8] transition-all shadow-xs"
            >
              <Terminal className="w-3.5 h-3.5 text-[#6D4AFF]" />
              <span>Trace ({agent.llmCallsCount} LLM calls)</span>
            </button>
          )}
        </div>
      </div>

      {/* Mode Switcher Toggle */}
      <div className="bg-lavender-50/70 p-1.5 rounded-2xl border border-[#DDD8F5] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setPipelineMode('agent')}
            className={clsx(
              'flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all',
              isAgentMode
                ? 'bg-[#6D4AFF] text-white shadow-sm'
                : 'text-body hover:text-ink'
            )}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Agent Mode (LangGraph Python)</span>
            <span className={clsx('text-[9px] uppercase px-1.5 py-0.5 rounded font-mono', isAgentMode ? 'bg-white/20 text-white' : 'bg-lavender-200 text-[#6D4AFF]')}>
              Default
            </span>
          </button>

          <button
            type="button"
            onClick={() => setPipelineMode('quick')}
            className={clsx(
              'flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all',
              !isAgentMode
                ? 'bg-[#6D4AFF] text-white shadow-sm'
                : 'text-body hover:text-ink'
            )}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Quick Mode (Stateless)</span>
          </button>
        </div>

        <span className="text-[11px] text-body pr-3">
          {isAgentMode
            ? 'Stateful graph • Self-revision gate • Tool calls • Interrupt checkpoint • Parallel fan-out'
            : 'Stateless 4-call sequence orchestrated directly from client.'}
        </span>
      </div>

      {/* Health / Warmup Banner for Python Agent Backend */}
      {isAgentMode && agent.agentHealth === 'offline' && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-amber-900">
                Agent Mode needs the local LangGraph backend. Showing sample/quick mode instead.
              </div>
              <div className="text-[11px] text-amber-700">
                Run the local Python backend on port 8000 to stream live, or watch an instant recorded run.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={agent.replaySampleRun}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs"
            >
              Watch a recorded run
            </button>
            <button
              type="button"
              onClick={agent.checkAgentHealth}
              className="px-3 py-1.5 bg-white border border-amber-300 text-amber-800 rounded-xl text-xs font-bold hover:bg-amber-100"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 1. Pain Point Input Form */}
      <Card>
        <PainPointForm
          initialValues={activeInput}
          onSubmit={handleFormSubmit}
          isLoading={isCurrentlyLoading}
        />
      </Card>

      {/* 2. Visual Pipeline Execution Representation */}
      <Card>
        {isAgentMode ? (
          <AgentGraph
            nodes={agent.nodes}
            activeNode={agent.activeNode}
            revisionCount={agent.revisionCount}
            isFinished={agent.isFinished}
            isSampleReplay={agent.isSampleReplay}
          />
        ) : (
          <AgentPipeline stages={quick.stages} currentStageId={quick.currentStageId} />
        )}
      </Card>

      {/* Human-in-the-Loop Interrupt Card (When paused at human_select) */}
      {isAgentMode && agent.interruptData && (
        <HumanSelectCard
          interruptData={agent.interruptData}
          onResume={agent.resumeRun}
          isResuming={agent.isResuming}
          onRestart={agent.resetAgent}
          errorMessage={agent.error}
        />
      )}

      {/* Execution Trace & Observability Drawer */}
      {isAgentMode && (
        <TraceDrawer
          traces={agent.traces}
          llmCallsCount={agent.llmCallsCount}
          threadId={agent.threadId}
          isOpen={isTraceDrawerOpen}
          onToggle={() => setIsTraceDrawerOpen(!isTraceDrawerOpen)}
        />
      )}

      {/* 3. Hero Feature Split: Reel Phone Preview + Script Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: ReelPhone (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center sticky top-20">
          <ReelPhone
            script={primaryScript}
            storyboardFrames={activeMediaPlanData.storyboardFrames}
            language={activeInput.language}
            autoPlay={true}
          />
        </div>

        {/* Right Column: Script Timeline (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <ScriptTimeline
            scripts={activeScriptsData.scripts}
            selectedScriptIndex={activeScriptIndex}
            onSelectScriptIndex={setActiveScriptIndex}
          />
        </div>
      </div>

      {/* 4. Ranked Hook Board */}
      <HookBoard
        hooks={activeRankedHooks}
        selectedHookId={primaryScript?.hookId}
        onSelectHookForScript={(hookId) => {
          const idx = activeScriptsData.scripts.findIndex((s) => s.hookId === hookId);
          if (idx !== -1) setActiveScriptIndex(idx);
        }}
      />

      {/* 5. Vertical Storyboard Grid */}
      <StoryboardGrid frames={activeMediaPlanData.storyboardFrames} />

      {/* 6. Text-to-Video Prompt Pack (Veo / Runway) */}
      <VideoPromptPack prompts={activeMediaPlanData.videoPrompts} />

      {/* 7. Ready To Ship Action Bar */}
      <ExportBar
        painPoint={activeInput.painPoint}
        audience={activeInput.audience}
        language={activeInput.language}
        topHooks={activeRankedHooks}
        primaryScript={primaryScript}
        storyboard={activeMediaPlanData.storyboardFrames}
        videoPrompts={activeMediaPlanData.videoPrompts}
      />
    </div>
  );
};

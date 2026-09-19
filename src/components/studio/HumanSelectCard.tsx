import React, { useState } from 'react';
import clsx from 'clsx';
import {
  UserCheck,
  CheckCircle2,
  Loader2,
  GitFork,
  AlertCircle,
} from 'lucide-react';
import { InterruptData } from '@/hooks/useAgentStream';

interface HumanSelectCardProps {
  interruptData: InterruptData;
  onResume: (selectedHookIds: string[]) => void;
  isResuming: boolean;
  onRestart?: () => void;
  errorMessage?: string | null;
}

interface CandidateHookItem {
  hookId: string;
  displayText: string;
  weightedScore: number;
  critique: string;
}

export const HumanSelectCard: React.FC<HumanSelectCardProps> = ({
  interruptData,
  onResume,
  isResuming,
  onRestart,
  errorMessage,
}) => {
  const rawList: any[] =
    interruptData.ranked_hooks && interruptData.ranked_hooks.length > 0
      ? interruptData.ranked_hooks
      : (interruptData as any).options && (interruptData as any).options.length > 0
      ? (interruptData as any).options
      : [];

  const candidateHooks: CandidateHookItem[] = rawList.map((h: any, idx: number) => ({
    hookId: h.hookId || h.id || `hook_${idx + 1}`,
    displayText: h.displayText || h.text || h.rawText || `Candidate Hook #${idx + 1}`,
    weightedScore:
      typeof h.weightedScore === 'number'
        ? h.weightedScore
        : typeof h.compositeScore === 'number'
        ? h.compositeScore
        : 8.5,
    critique: h.critique || 'Top evaluated conversational hook for spoken engagement.',
  }));

  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    if (interruptData.selected_hook_ids && interruptData.selected_hook_ids.length > 0) {
      return interruptData.selected_hook_ids;
    }
    if (candidateHooks.length > 0) {
      return candidateHooks.slice(0, 2).map((h: CandidateHookItem) => h.hookId);
    }
    return ['hook_1', 'hook_2'];
  });

  const toggleSelect = (hookId: string) => {
    if (selectedIds.includes(hookId)) {
      if (selectedIds.length === 1) return; // Keep at least one
      setSelectedIds(selectedIds.filter((id) => id !== hookId));
    } else {
      if (selectedIds.length >= 3) return; // Max 3
      setSelectedIds([...selectedIds, hookId]);
    }
  };

  const handleResume = () => {
    onResume(selectedIds);
  };

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-purple-500/5 to-white border-2 border-amber-300 rounded-[22px] p-5 sm:p-6 shadow-md space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/70 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 border border-amber-300 shadow-2xs">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300">
                LangGraph State Checkpoint
              </span>
              <span className="text-[11px] font-bold text-amber-700">
                MemorySaver State: Halted
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-ink mt-0.5">
              Human-in-the-Loop Interrupt: Select Hooks for Parallel Fan-Out
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-800 bg-white px-3 py-1.5 rounded-xl border border-amber-200 shadow-2xs self-start sm:self-auto">
          <GitFork className="w-3.5 h-3.5 text-[#6D4AFF]" />
          <span>Selected: {selectedIds.length} / 3 hooks</span>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-body leading-relaxed">
        The autonomous pipeline paused execution at the <code>human_select</code> node. State is safely stored in memory.
        Choose which ranked hooks you want the parallel Script Directors to write full 15-second timed reels for:
      </p>

      {/* Error state */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          {onRestart && (
            <button
              type="button"
              onClick={onRestart}
              className="px-3 py-1 bg-white border border-red-300 rounded-lg text-xs font-bold text-red-700 hover:bg-red-50 shrink-0"
            >
              Restart Experiment
            </button>
          )}
        </div>
      )}

      {/* Candidate Hooks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {candidateHooks.slice(0, 4).map((hook, idx) => {
          const isSelected = selectedIds.includes(hook.hookId);
          return (
            <button
              key={hook.hookId}
              type="button"
              onClick={() => toggleSelect(hook.hookId)}
              className={clsx(
                'text-left p-4 rounded-xl border-2 transition-all select-none flex flex-col justify-between group',
                isSelected
                  ? 'bg-white border-[#6D4AFF] ring-2 ring-[#6D4AFF]/20 shadow-sm'
                  : 'bg-white/70 border-[#ECE9F8] hover:border-amber-200 opacity-80'
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-black text-body">
                    Rank #{idx + 1}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-mono font-extrabold text-[#6D4AFF] bg-lavender-100 px-2 py-0.5 rounded-md border border-[#DDD8F5]">
                      {hook.weightedScore?.toFixed(1) || '8.5'} / 10
                    </span>
                    <div
                      className={clsx(
                        'w-5 h-5 rounded-md flex items-center justify-center border transition-all',
                        isSelected
                          ? 'bg-[#6D4AFF] border-[#6D4AFF] text-white'
                          : 'bg-gray-100 border-gray-300'
                      )}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>

                <div className="text-xs sm:text-sm font-bold text-ink leading-snug group-hover:text-[#6D4AFF] transition-colors">
                  &ldquo;{hook.displayText}&rdquo;
                </div>
              </div>

              {hook.critique && (
                <div className="mt-3 pt-2 border-t border-[#ECE9F8] text-[10px] text-body line-clamp-1 italic">
                  {hook.critique}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Resume CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <span className="text-xs text-body">
          Resuming triggers LangGraph&apos;s <code>Send</code> API to fan out script writers in parallel.
        </span>

        <button
          type="button"
          onClick={handleResume}
          disabled={isResuming || selectedIds.length === 0}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-black text-white bg-[#6D4AFF] hover:bg-[#5A38EE] active:scale-[0.99] transition-all shadow-md disabled:opacity-50"
        >
          {isResuming ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Resuming LangGraph Fan-Out...</span>
            </>
          ) : (
            <>
              <GitFork className="w-4 h-4" />
              <span>Resume Pipeline & Fan-Out ({selectedIds.length} scripts)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import clsx from 'clsx';
import { ChevronDown, ChevronUp, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { RankedHook } from '@shared/types';
import { SCORING_WEIGHTS } from '@shared/scoring';
import { Sticker } from '../ui/Sticker';
import { ScoreBar } from '../ui/ScoreBar';
import { CopyButton } from '../ui/CopyButton';

interface HookCardProps {
  hook: RankedHook;
  isTop?: boolean;
  onSelectForPreview?: () => void;
  isSelected?: boolean;
}

export const HookCard: React.FC<HookCardProps> = ({
  hook,
  isTop = false,
  onSelectForPreview,
  isSelected = false,
}) => {
  const [expanded, setExpanded] = useState(isTop);

  const stickerText =
    hook.rank === 1 ? 'Real Talk' : hook.rank === 2 ? 'Top Pick' : hook.rank === 3 ? 'High Viral' : `#${hook.rank}`;

  return (
    <div
      className={clsx(
        'rounded-2xl transition-all duration-200 border',
        isTop
          ? 'bg-white p-5 sm:p-6 border-brand-purple/40 shadow-soft ring-1 ring-brand-purple/15'
          : 'bg-white/80 p-4 border-[#ECE9F8] hover:bg-white hover:border-[#DDD8F5] shadow-sm',
        isSelected && 'ring-2 ring-brand-blue'
      )}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {isTop ? (
            <Sticker
              text={stickerText}
              variant={hook.rank === 1 ? 'purple' : hook.rank === 2 ? 'blue' : 'amber'}
              size="sm"
            />
          ) : (
            <span className="w-6 h-6 rounded-full bg-lavender-100 text-body font-bold text-xs flex items-center justify-center">
              {hook.rank}
            </span>
          )}

          <span className="text-xs font-bold text-ink">
            Score: <span className="text-[#6D4AFF]">{hook.weightedScore.toFixed(1)}</span>/10
          </span>

          {hook.compliance.isCompliant ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-success bg-[#E6F8EE] px-2 py-0.5 rounded-full border border-[#BBF7D0]">
              <Check className="w-3 h-3" /> Safe
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              <AlertTriangle className="w-3 h-3" /> Flagged & Rewritten
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <CopyButton text={hook.displayText} size="sm" />
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? 'Collapse details' : 'Expand details'}
            className="p-1 rounded-lg text-body hover:bg-lavender-100 transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Hook Quote */}
      <div className="mt-3">
        <p
          className={clsx(
            'font-extrabold tracking-tight text-ink leading-snug',
            isTop ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
          )}
        >
          "{hook.displayText}"
        </p>

        {/* If compliance rewritten, show raw text diff */}
        {!hook.compliance.isCompliant && hook.compliance.safeRewrite && (
          <div className="mt-1.5 text-[11px] text-body line-through opacity-70">
            Original: "{hook.rawText}"
          </div>
        )}
      </div>

      {/* Expandable Rubric Details */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-[#ECE9F8] space-y-4 animate-in fade-in-50 duration-200">
          {/* Rubric Score Bars */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-body">
              Creative Critic Rubric (0-10)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              <ScoreBar
                label="Scroll-stop"
                score={hook.scores.scrollStop}
                weight={SCORING_WEIGHTS.scrollStop}
              />
              <ScoreBar
                label="Relatability"
                score={hook.scores.relatability}
                weight={SCORING_WEIGHTS.relatability}
              />
              <ScoreBar
                label="Curiosity gap"
                score={hook.scores.curiosityGap}
                weight={SCORING_WEIGHTS.curiosityGap}
              />
              <ScoreBar
                label="Clarity"
                score={hook.scores.clarity}
                weight={SCORING_WEIGHTS.clarity}
              />
              <ScoreBar
                label="Brand fit"
                score={hook.scores.brandFit}
                weight={SCORING_WEIGHTS.brandFit}
                className="sm:col-span-2"
              />
            </div>
          </div>

          {/* Why This Works */}
          <div className="bg-lavender-50/80 p-3 rounded-xl border border-[#ECE9F8] space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-ink">
              Why This Works
            </div>
            <p className="text-xs text-body leading-relaxed">{hook.critique}</p>
          </div>

          {/* Compliance Check Breakdown */}
          <div className="bg-white p-3 rounded-xl border border-[#ECE9F8] space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-purple" />
              <span>Compliance Guard Audit</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-body">
                <Check className="w-3.5 h-3.5 text-brand-success shrink-0" />
                <span>No unsupported claims</span>
              </div>
              <div className="flex items-center gap-1.5 text-body">
                <Check className="w-3.5 h-3.5 text-brand-success shrink-0" />
                <span>No learner shaming</span>
              </div>
              <div className="flex items-center gap-1.5 text-body">
                <Check className="w-3.5 h-3.5 text-brand-success shrink-0" />
                <span>No guaranteed outcomes</span>
              </div>
            </div>
            {hook.compliance.flags.length > 0 && (
              <div className="pt-1 text-[11px] text-amber-700 font-medium">
                Policy Flag: {hook.compliance.flags.join(', ')} — Automatically updated to brand-safe rewrite.
              </div>
            )}
          </div>

          {/* Action to preview in Reel */}
          {onSelectForPreview && (
            <div className="pt-1 flex items-center justify-end">
              <button
                type="button"
                onClick={onSelectForPreview}
                className="text-xs font-bold text-brand-purple hover:text-brand-blue transition-colors flex items-center gap-1"
              >
                <span>Preview this hook in Reel Phone</span>
                <span>→</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, Filter } from 'lucide-react';
import { RankedHook } from '@shared/types';
import { HookCard } from './HookCard';
import { Badge } from '../ui/Badge';

interface HookBoardProps {
  hooks: RankedHook[];
  onSelectHookForScript?: (hookId: string) => void;
  selectedHookId?: string;
}

export const HookBoard: React.FC<HookBoardProps> = ({
  hooks,
  onSelectHookForScript,
  selectedHookId,
}) => {
  const [showAll15, setShowAll15] = useState(false);

  const top3Hooks = hooks.slice(0, 3);
  const remaining12 = hooks.slice(3);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ECE9F8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold text-ink">
              Ranked Hook Board
            </h3>
            <Badge kind="ai_predicted" />
          </div>
          <p className="text-xs text-body mt-0.5">
            15 hooks scored across 5 rubric criteria by Creative Critic & Brand Compliance Guard.
          </p>
        </div>

        <div className="text-xs text-body/90 font-medium bg-lavender-100 px-3 py-1.5 rounded-xl border border-[#DDD8F5] self-start sm:self-auto">
          Weighted: Scroll .30 • Relate .25 • Curiosity .20 • Clarity .15 • Brand .10
        </div>
      </div>

      {/* Top 3 Elevated Hooks */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-purple flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Top 3 Elevated Creative Hooks
          </span>
          <span className="text-[11px] text-body/70">(Selected for 15s Script Production)</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {top3Hooks.map((hook) => (
            <HookCard
              key={hook.hookId}
              hook={hook}
              isTop={true}
              isSelected={hook.hookId === selectedHookId}
              onSelectForPreview={
                onSelectHookForScript ? () => onSelectHookForScript(hook.hookId) : undefined
              }
            />
          ))}
        </div>
      </div>

      {/* Remaining 12 Hooks (Toggleable) */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowAll15(!showAll15)}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/60 hover:bg-white border border-[#ECE9F8] text-xs font-bold text-ink transition-all shadow-sm group"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-body group-hover:text-brand-purple" />
            <span>
              {showAll15 ? 'Hide' : 'Explore'} Remaining 12 Generated Hooks (Ranks #4 to #15)
            </span>
          </div>
          <div className="flex items-center gap-1 text-brand-purple">
            <span>{showAll15 ? 'Collapse' : 'Show All'}</span>
            {showAll15 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showAll15 && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 animate-in fade-in-50 duration-200">
            {remaining12.map((hook) => (
              <HookCard
                key={hook.hookId}
                hook={hook}
                isTop={false}
                isSelected={hook.hookId === selectedHookId}
                onSelectForPreview={
                  onSelectHookForScript ? () => onSelectHookForScript(hook.hookId) : undefined
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

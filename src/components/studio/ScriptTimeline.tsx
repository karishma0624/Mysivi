import React, { useState } from 'react';
import clsx from 'clsx';
import { Clock, Volume2, Eye, Music, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { ScriptItem } from '@shared/types';
import { CopyButton } from '../ui/CopyButton';

interface ScriptTimelineProps {
  scripts: ScriptItem[];
  selectedScriptIndex: number;
  onSelectScriptIndex: (index: number) => void;
}

export const ScriptTimeline: React.FC<ScriptTimelineProps> = ({
  scripts,
  selectedScriptIndex,
  onSelectScriptIndex,
}) => {
  const [expandedBeats, setExpandedBeats] = useState<Record<number, boolean>>({});

  const currentScript = scripts[selectedScriptIndex] || scripts[0];
  if (!currentScript) return null;

  const hookDisplay = currentScript.hookText || currentScript.beats?.[0]?.voiceover || 'Script Concept';

  const toggleExpand = (idx: number) => {
    setExpandedBeats((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Script Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ECE9F8] pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-ink">15-Second Video Script Timeline</h3>
          <p className="text-xs text-body">
            Structured into 4 rapid retention beats with timed voiceover, on-screen captions, and visual directives.
          </p>
        </div>

        {/* Script Switcher */}
        <div className="flex items-center gap-2">
          {scripts.map((script, idx) => (
            <button
              key={script.hookId || idx}
              onClick={() => onSelectScriptIndex(idx)}
              className={clsx(
                'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border',
                selectedScriptIndex === idx
                  ? 'bg-brand-purple text-white border-brand-purple shadow-sm shadow-brand-purple/30'
                  : 'bg-white text-body border-[#ECE9F8] hover:bg-lavender-50'
              )}
            >
              Script #{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Script Meta Summary */}
      <div className="bg-white p-4 rounded-2xl border border-[#ECE9F8] shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-purple">
            Hook Concept #{selectedScriptIndex + 1}
          </span>
          <h4 className="text-sm font-extrabold text-ink mt-0.5">
            "{hookDisplay}"
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton
            text={`Hook: "${hookDisplay}"\n\n${currentScript.beats
              .map((b) => `[${b.timecode}] ${b.name}: ${b.voiceover}`)
              .join('\n')}\n\nCTA: ${currentScript.cta}`}
            label="Copy Script"
            size="sm"
          />
        </div>
      </div>

      {/* 4 Beats Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
        {currentScript.beats.map((beat, idx) => {
          const isExpanded = Boolean(expandedBeats[idx]);
          const beatColors = [
            'border-pastel-indigo bg-pastel-indigo/30',
            'border-pastel-amber bg-pastel-amber/30',
            'border-pastel-mint bg-pastel-mint/30',
            'border-pastel-sky bg-pastel-sky/30',
          ];

          return (
            <div
              key={idx}
              className={clsx(
                'rounded-2xl p-4 border bg-white shadow-card flex flex-col justify-between space-y-3 transition-all cursor-pointer hover:shadow-md',
                beatColors[idx % beatColors.length]
              )}
              onClick={() => toggleExpand(idx)}
            >
              {/* Beat header */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#6D4AFF] bg-white px-2 py-0.5 rounded-md border border-[#ECE9F8]">
                    <Clock className="w-3 h-3" />
                    {beat.timecode}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-body">
                      Beat 0{idx + 1}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-body" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-body" />
                    )}
                  </div>
                </div>
                <h5 className="text-sm font-bold text-ink">{beat.name}</h5>
              </div>

              {/* Voiceover */}
              <div className="bg-white/90 p-3 rounded-xl border border-[#ECE9F8] space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-brand-purple flex items-center gap-1">
                  <Volume2 className="w-3 h-3" />
                  <span>Voiceover</span>
                </div>
                <p className={clsx(
                  'text-xs text-ink leading-relaxed font-medium',
                  !isExpanded && 'line-clamp-3'
                )}>
                  "{beat.voiceover}"
                </p>
              </div>

              {/* Caption */}
              <div className="bg-white/90 p-2.5 rounded-xl border border-[#ECE9F8] space-y-0.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-body flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  <span>On-Screen Caption</span>
                </div>
                <p className={clsx(
                  'text-xs text-body font-mono',
                  !isExpanded && 'line-clamp-2'
                )}>
                  {beat.caption}
                </p>
              </div>

              {/* Visual direction */}
              <div className="text-[11px] text-body leading-relaxed space-y-0.5">
                <div className="flex items-center justify-between font-semibold text-ink text-[10px] uppercase">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-body" />
                    <span>Visual</span>
                  </span>
                  <span className="text-[9px] text-brand-purple font-normal lowercase">
                    {isExpanded ? 'collapse' : 'click to expand'}
                  </span>
                </div>
                <p className={clsx(
                  'text-body/90',
                  !isExpanded ? 'line-clamp-3' : 'leading-normal'
                )}>
                  {beat.visual}
                </p>
              </div>

              {/* Audio vibe */}
              <div className="pt-2 border-t border-[#ECE9F8] flex items-center gap-1.5 text-[10px] text-body/80">
                <Music className="w-3 h-3 text-brand-purple shrink-0" />
                <span className={isExpanded ? 'break-words' : 'truncate'}>{beat.audioVibe}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to action note */}
      <div className="p-4 rounded-2xl bg-lavender-50 border border-[#ECE9F8] flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-ink">Call to Action:</span>
          <span className="text-xs font-medium text-body">"{currentScript.cta}"</span>
        </div>
      </div>
    </div>
  );
};

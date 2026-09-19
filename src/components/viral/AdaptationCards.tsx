import React from 'react';
import { Sparkles, ArrowDown, MessageSquare } from 'lucide-react';
import { TrendAdaptation } from '@shared/types';
import { Card } from '../ui/Card';
import { CopyButton } from '../ui/CopyButton';

interface AdaptationCardsProps {
  adaptations: TrendAdaptation[];
}

export const AdaptationCards: React.FC<AdaptationCardsProps> = ({ adaptations }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ECE9F8] pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-ink">
            Format-to-Learning Adaptations
          </h3>
          <p className="text-xs text-body mt-0.5">
            How viral entertainment tropes translate into emotionally grounded spoken English practice.
          </p>
        </div>

        <span className="text-xs font-semibold text-brand-purple bg-lavender-50 px-3 py-1.5 rounded-xl border border-[#ECE9F8]">
          3 Creative Adaptations
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {adaptations.map((a, idx) => (
          <Card key={idx} className="flex flex-col justify-between space-y-4 hover:border-brand-purple/30 transition-all">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-purple bg-lavender-100 px-2.5 py-0.5 rounded-full">
                  Concept 0{idx + 1}
                </span>
                <CopyButton
                  text={`Hook: "${a.hook}"\n\nBeats:\n${a.beats.join('\n')}\n\nCTA: ${a.cta}`}
                  label="Copy"
                  size="sm"
                />
              </div>

              {/* Original Format */}
              <div className="p-2.5 rounded-xl bg-lavender-50/70 border border-[#ECE9F8] space-y-0.5 text-xs">
                <span className="text-[9px] font-bold uppercase text-body/80">Original Format</span>
                <p className="text-body font-medium">{a.originalFormat}</p>
              </div>

              <div className="flex justify-center text-brand-purple/60">
                <ArrowDown className="w-3.5 h-3.5" />
              </div>

              {/* MySivi Adaptation */}
              <div className="p-2.5 rounded-xl bg-white border border-brand-purple/30 space-y-0.5 text-xs shadow-xs">
                <span className="text-[9px] font-bold uppercase text-brand-purple flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> MySivi Learning Angle
                </span>
                <p className="text-ink font-semibold">{a.mysiviAdaptation}</p>
              </div>
            </div>

            {/* Hook */}
            <div className="bg-lavender-50 p-3 rounded-xl border border-[#ECE9F8] space-y-1">
              <span className="text-[10px] font-bold uppercase text-body">Spoken Hook Line</span>
              <p className="text-xs font-extrabold text-ink leading-snug">"{a.hook}"</p>
            </div>

            {/* 4 Beats */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-body">Narrative Beats</span>
              <ul className="space-y-1 text-xs text-body">
                {a.beats.map((beat, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-1.5 text-[11px] leading-relaxed">
                    <span className="font-mono text-brand-purple font-bold">0{bIdx + 1}.</span>
                    <span>{beat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="pt-2 border-t border-[#ECE9F8] text-[11px] text-body flex items-start gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-brand-success shrink-0 mt-0.5" />
              <span><strong>Engagement CTA:</strong> {a.cta}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

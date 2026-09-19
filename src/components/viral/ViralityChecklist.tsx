import React from 'react';
import { Lightbulb } from 'lucide-react';
import { ViralityChecklistItem } from '@shared/types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ScoreBar } from '../ui/ScoreBar';

interface ViralityChecklistProps {
  checklist: ViralityChecklistItem[];
}

export const ViralityChecklist: React.FC<ViralityChecklistProps> = ({ checklist }) => {
  return (
    <Card className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ECE9F8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold text-ink">
              Algorithm Virality Checklist
            </h3>
            <Badge kind="heuristic" />
          </div>
          <p className="text-xs text-body mt-0.5">
            Qualitative heuristic evaluation based on short-form distribution principles.
          </p>
        </div>

        <div className="text-xs text-body/90 font-medium bg-lavender-100 px-3 py-1.5 rounded-xl border border-[#DDD8F5]">
          Rubric: Hook • Retention • Shareability • Comment Trigger
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {checklist.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-lavender-50/50 border border-[#ECE9F8] space-y-3"
          >
            {/* Title & Score */}
            <div className="space-y-2">
              <ScoreBar label={item.criterion} score={item.score} />
            </div>

            {/* Heuristic reasoning */}
            <div className="text-xs space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-body">
                Algorithmic Assessment
              </span>
              <p className="text-body leading-relaxed text-[11px] font-medium">
                {item.heuristicReasoning}
              </p>
            </div>

            {/* Improvement Tip */}
            <div className="pt-2 border-t border-[#ECE9F8] flex items-start gap-2 text-xs bg-white p-2.5 rounded-xl">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-ink text-[11px] leading-relaxed">
                <strong>Iteration Tip:</strong> {item.improvementTip}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

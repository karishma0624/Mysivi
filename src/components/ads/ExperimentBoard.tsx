import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Sparkles } from 'lucide-react';
import { SAMPLE_WEEKLY_EXPERIMENTS, WeeklyExperiment } from '@/data/samples/ads.sample';
import { Card } from '../ui/Card';

export const ExperimentBoard: React.FC = () => {
  const [experiments] = useState<WeeklyExperiment[]>(SAMPLE_WEEKLY_EXPERIMENTS);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ECE9F8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold text-ink">
              Weekly Creative Experimentation Cadence
            </h3>
            <span className="text-[10px] font-bold text-body/80 bg-lavender-100 px-2 py-0.5 rounded-full">
              Growth Playbook
            </span>
          </div>
          <p className="text-xs text-body mt-0.5">
            Hypothesis-driven creative experiments documented weekly to build compound growth learning.
          </p>
        </div>

        <div className="text-xs font-semibold text-brand-purple bg-lavender-50 px-3 py-1.5 rounded-xl border border-[#ECE9F8]">
          Velocity: 1 Quantitative Experiment / Week
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {experiments.map((exp) => {
          const isScale = exp.statisticalDecision === 'SCALE';
          const isKill = exp.statisticalDecision === 'KILL';

          return (
            <Card key={exp.weekNumber} className="space-y-4 hover:border-brand-purple/30 transition-all">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ECE9F8] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-lavender-100 text-brand-purple flex items-center justify-center font-bold text-xs">
                    W{exp.weekNumber}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-ink">
                      Week {exp.weekNumber} ({exp.dateRange})
                    </h4>
                    <span className="text-[11px] text-body font-medium">
                      Tested: {exp.variantTested}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      isScale
                        ? 'bg-[#E6F8EE] text-[#12A36B] border-[#BBF7D0]'
                        : isKill
                        ? 'bg-rose-50 text-rose-600 border-rose-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {isScale ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : isKill ? (
                      <XCircle className="w-3 h-3" />
                    ) : (
                      <RotateCcw className="w-3 h-3" />
                    )}
                    <span>{exp.statisticalDecision}</span>
                  </span>

                  <span className="text-xs font-mono font-bold text-ink bg-lavender-50 px-2.5 py-1 rounded-lg border border-[#ECE9F8]">
                    {exp.metricLift}
                  </span>
                </div>
              </div>

              {/* Hypothesis & Learning */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-lavender-50/60 border border-[#ECE9F8] space-y-1">
                  <span className="text-[10px] font-bold uppercase text-body tracking-wider">
                    Tested Hypothesis
                  </span>
                  <p className="text-body leading-relaxed font-medium">
                    "{exp.hypothesis}"
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#ECE9F8] space-y-1">
                  <span className="text-[10px] font-bold uppercase text-brand-purple tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Key Strategic Learning
                  </span>
                  <p className="text-ink leading-relaxed font-medium">
                    {exp.learning}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

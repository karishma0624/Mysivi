import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  BrainCircuit,
  Calculator,
} from 'lucide-react';
import { ComputedVariantStats } from '@/lib/stats';
import { formatInr, formatPercent, formatNumber } from '@/lib/format';
import { api } from '@/lib/api';
import { Card } from '../ui/Card';

interface VerdictCardProps {
  variant: ComputedVariantStats;
}

export const VerdictCard: React.FC<VerdictCardProps> = ({ variant }) => {
  const [plainVerdict, setPlainVerdict] = useState<string>('');
  const [statInsight, setStatInsight] = useState<string>('');
  const [whatNext, setWhatNext] = useState<string>('');
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchExplanation() {
      setLoadingExplanation(true);
      try {
        const res = await api.explainAdExperiment({
          variantId: variant.id,
          variantName: variant.name,
          impressions: variant.impressions,
          clicks: variant.clicks,
          installs: variant.installs,
          spend: variant.spend,
          ctr: variant.ctr,
          cpi: variant.cpi,
          zScoreCtr: variant.zScoreCtr,
          pValueCtr: variant.pValueCtr,
          zScoreCpi: variant.zScoreInstallRate,
          verdict: variant.verdict,
        });

        if (isMounted) {
          setPlainVerdict(res.data.plainEnglishVerdict);
          setStatInsight(res.data.statisticalInsight);
          setWhatNext(res.data.whatToTestNext);
        }
      } catch {
        if (isMounted) {
          setPlainVerdict(variant.verdictReason);
          setStatInsight(`Evaluated with ${variant.impressions.toLocaleString()} impressions.`);
          setWhatNext('Run for 48 more hours to gather further statistical power.');
        }
      } finally {
        if (isMounted) setLoadingExplanation(false);
      }
    }

    fetchExplanation();
    return () => {
      isMounted = false;
    };
  }, [variant.id, variant.impressions, variant.clicks, variant.installs, variant.spend, variant.verdict]);

  const getVerdictStyle = (v: typeof variant.verdict) => {
    if (v === 'SCALE') {
      return {
        bg: 'bg-[#E6F8EE]',
        text: 'text-[#12A36B]',
        border: 'border-[#BBF7D0]',
        icon: <CheckCircle2 className="w-5 h-5 text-[#12A36B]" />,
        title: 'DECISION: SCALE WINNING CREATIVE',
      };
    }
    if (v === 'KILL') {
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-600',
        border: 'border-rose-200',
        icon: <XCircle className="w-5 h-5 text-rose-600" />,
        title: 'DECISION: KILL UNDERPERFORMER',
      };
    }
    return {
      bg: 'bg-[#FFF4E0]',
      text: 'text-[#D97706]',
      border: 'border-[#FDE68A]',
      icon: <Clock className="w-5 h-5 text-[#D97706]" />,
      title: 'DECISION: KEEP TESTING (INCONCLUSIVE)',
    };
  };

  const style = getVerdictStyle(variant.verdict);

  return (
    <Card className="space-y-6 border-2 border-[#ECE9F8]">
      {/* Header and Architecture Callout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ECE9F8] pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-body">
            Analytical Growth Memo
          </span>
          <h3 className="text-xl font-black text-ink">{variant.name}</h3>
        </div>

        {/* Responsible AI Callout Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lavender-50 border border-[#ECE9F8] text-[11px] text-body">
          <Calculator className="w-3.5 h-3.5 text-brand-purple" />
          <span>TypeScript calculates math • LLM translates to marketing English</span>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-3.5 rounded-2xl bg-lavender-50/70 border border-[#ECE9F8] space-y-0.5">
          <span className="text-[10px] font-bold uppercase text-body">Cost Per Install (CPI)</span>
          <div className="text-xl font-black text-ink font-mono">{formatInr(variant.cpi)}</div>
          <span className="text-[10px] text-body/80">Benchmark ₹35.00</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-lavender-50/70 border border-[#ECE9F8] space-y-0.5">
          <span className="text-[10px] font-bold uppercase text-body">Click-Through Rate</span>
          <div className="text-xl font-black text-brand-purple font-mono">{formatPercent(variant.ctr)}</div>
          <span className="text-[10px] text-body/80">
            {variant.zScoreCtr ? `Z-Score: ${variant.zScoreCtr}` : 'Baseline'}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-lavender-50/70 border border-[#ECE9F8] space-y-0.5">
          <span className="text-[10px] font-bold uppercase text-body">Sample Volume</span>
          <div className="text-xl font-black text-ink font-mono">{formatNumber(variant.impressions)}</div>
          <span className="text-[10px] text-body/80">{variant.clicks} clicks • {variant.installs} installs</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-lavender-50/70 border border-[#ECE9F8] space-y-0.5">
          <span className="text-[10px] font-bold uppercase text-body">Statistical Confidence</span>
          <div className="text-xl font-black text-ink font-mono">
            {variant.pValueCtr !== null ? `${Math.round((1 - variant.pValueCtr) * 100)}%` : '—'}
          </div>
          <span className="text-[10px] text-body/80">
            {variant.isCtrSignificant ? '★ 95%+ Confidence' : 'Below 95% threshold'}
          </span>
        </div>
      </div>

      {/* Decision Banner */}
      <div className={`p-4 rounded-2xl border ${style.bg} ${style.border} flex items-start gap-3`}>
        <span className="mt-0.5 shrink-0">{style.icon}</span>
        <div className="space-y-1">
          <h4 className={`text-sm font-black uppercase tracking-wider ${style.text}`}>
            {style.title}
          </h4>
          <p className="text-xs text-ink/90 leading-relaxed font-medium">
            {loadingExplanation ? 'Synthesizing qualitative analysis...' : plainVerdict || variant.verdictReason}
          </p>
        </div>
      </div>

      {/* Two Columns: Statistical Evidence & What I'd Test Next */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Statistical Insight */}
        <div className="p-4 rounded-2xl bg-white border border-[#ECE9F8] space-y-1.5 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-body flex items-center gap-1.5">
            <BrainCircuit className="w-3.5 h-3.5 text-brand-blue" />
            <span>Statistical Evidence</span>
          </div>
          <p className="text-xs text-body leading-relaxed">
            {statInsight || 'Sufficient sample size accumulated to evaluate unit economic viability.'}
          </p>
        </div>

        {/* What I'd test next */}
        <div className="p-4 rounded-2xl bg-lavender-50 border border-[#ECE9F8] space-y-1.5 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-purple flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
            <span>What I'd Test Next</span>
          </div>
          <p className="text-xs text-ink leading-relaxed font-medium">
            {whatNext || 'Isolate winning emotional hook and test alternative thumbnail framing.'}
          </p>
        </div>
      </div>
    </Card>
  );
};

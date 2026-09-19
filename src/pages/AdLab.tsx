import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  Sliders,
  Calculator,
  Calendar,
} from 'lucide-react';
import {
  SAMPLE_AD_VARIANTS,
  SAMPLE_CAMPAIGN_METRICS,
} from '@/data/samples/ads.sample';
import {
  analyzeCampaignVariants,
  CampaignVariantMetrics,
  ComputedVariantStats,
} from '@/lib/stats';
import { AdMatrix } from '@/components/ads/AdMatrix';
import { BudgetPlanner } from '@/components/ads/BudgetPlanner';
import { ResultsTable } from '@/components/ads/ResultsTable';
import { VerdictCard } from '@/components/ads/VerdictCard';
import { ExperimentBoard } from '@/components/ads/ExperimentBoard';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';

export const AdLab: React.FC = () => {
  const [variants] = useState(SAMPLE_AD_VARIANTS);
  const [campaignMetrics, setCampaignMetrics] = useState<CampaignVariantMetrics[]>(
    SAMPLE_CAMPAIGN_METRICS
  );
  const [selectedVariantId, setSelectedVariantId] = useState<string>('var_b');
  const [activeTab, setActiveTab] = useState<'analyzer' | 'matrix' | 'budget' | 'experiments'>('analyzer');

  // Deterministic statistical computation
  const computedStats: ComputedVariantStats[] = analyzeCampaignVariants(campaignMetrics, 35);
  const selectedVariantStats =
    computedStats.find((v) => v.id === selectedVariantId) || computedStats[0];

  const handleUpdateVariantMetric = (
    id: string,
    field: keyof CampaignVariantMetrics,
    value: number
  ) => {
    setCampaignMetrics((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleResetToSample = () => {
    setCampaignMetrics(SAMPLE_CAMPAIGN_METRICS);
  };

  return (
    <div className="space-y-10">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ECE9F8] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-purple bg-lavender-100 px-2.5 py-0.5 rounded-full border border-[#DDD8F5]">
              MODULE 2 • AD LAB
            </span>
            <Badge kind="simulated" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Paid Experimentation & Statistical Decision Engine
          </h1>
          <p className="text-xs sm:text-sm text-body mt-1 max-w-2xl">
            Demonstrating quantitative marketing rigor: Two-proportion z-tests evaluate creative variants for Scale, Test, or Kill decisions before scaling spend.
          </p>
        </div>

        {/* Responsible AI Notice Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#ECE9F8] shadow-sm text-xs font-semibold text-body self-start sm:self-auto">
          <Calculator className="w-4 h-4 text-brand-purple" />
          <span>Pure TypeScript Math • LLM Never Calculates</span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={(tab) => setActiveTab(tab as typeof activeTab)}
        tabs={[
          { id: 'analyzer', label: 'Results & Z-Tests', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'matrix', label: 'Meta Copy Matrix', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'budget', label: 'Budget Planner (Bandit)', icon: <Sliders className="w-4 h-4" /> },
          { id: 'experiments', label: 'Weekly Cadence', icon: <Calendar className="w-4 h-4" /> },
        ]}
      />

      {/* Tab 1: Results Analyzer & Verdict Memo */}
      {activeTab === 'analyzer' && (
        <div className="space-y-8 animate-in fade-in-50 duration-200">
          {/* Top Results Table */}
          <ResultsTable
            metrics={computedStats}
            onUpdateVariant={handleUpdateVariantMetric}
            onResetToSample={handleResetToSample}
            selectedVariantId={selectedVariantId}
            onSelectVariant={setSelectedVariantId}
          />

          {/* Selected Variant Decision Card */}
          {selectedVariantStats && <VerdictCard variant={selectedVariantStats} />}
        </div>
      )}

      {/* Tab 2: Meta Copy Matrix */}
      {activeTab === 'matrix' && (
        <div className="animate-in fade-in-50 duration-200">
          <AdMatrix variants={variants} />
        </div>
      )}

      {/* Tab 3: Budget Planner */}
      {activeTab === 'budget' && (
        <div className="animate-in fade-in-50 duration-200">
          <BudgetPlanner />
        </div>
      )}

      {/* Tab 4: Weekly Cadence */}
      {activeTab === 'experiments' && (
        <div className="animate-in fade-in-50 duration-200">
          <ExperimentBoard />
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Flame,
  Calendar,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { SAMPLE_VIRAL_PLAN } from '@/data/samples/viral.sample';
import { ViralPlanOutput, SupportedLanguage, Audience } from '@shared/types';
import { api } from '@/lib/api';
import { generateViralPlanMarkdown } from '@/lib/export';
import { TrendInput } from '@/components/viral/TrendInput';
import { AdaptationCards } from '@/components/viral/AdaptationCards';
import { CalendarGrid } from '@/components/viral/CalendarGrid';
import { CreatorBriefCard } from '@/components/viral/CreatorBriefCard';
import { ViralityChecklist } from '@/components/viral/ViralityChecklist';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CopyButton } from '@/components/ui/CopyButton';
import { Tabs } from '@/components/ui/Tabs';

export const ViralLab: React.FC = () => {
  const [viralPlan, setViralPlan] = useState<ViralPlanOutput>(SAMPLE_VIRAL_PLAN);
  const [isLoading, setIsLoading] = useState(false);
  const [isSampleRun, setIsSampleRun] = useState(true);
  const [activeTab, setActiveTab] = useState<'adaptations' | 'calendar' | 'creators' | 'checklist'>('adaptations');

  const handleGeneratePlan = async (params: {
    trendDescription: string;
    language: SupportedLanguage;
    audience: Audience;
    goal: string;
  }) => {
    setIsLoading(true);
    setIsSampleRun(false);

    try {
      const res = await api.planViral(params);
      setViralPlan(res.data);
      if (res.isSample) setIsSampleRun(true);
    } catch {
      setViralPlan(SAMPLE_VIRAL_PLAN);
      setIsSampleRun(true);
    } finally {
      setIsLoading(false);
    }
  };

  const planMarkdown = generateViralPlanMarkdown(viralPlan);

  return (
    <div className="space-y-10">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ECE9F8] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 bg-pastel-amber px-2.5 py-0.5 rounded-full border border-amber-200">
              MODULE 3 • VIRAL LAB
            </span>
            {isSampleRun ? <Badge kind="sample_run" /> : <Badge kind="ai_generated" text="Live Run" />}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Organic Growth & Viral Adaptation Engine
          </h1>
          <p className="text-xs sm:text-sm text-body mt-1 max-w-2xl">
            Transforms user-supplied cultural formats into spoken English learning concepts, a 7-day multi-format distribution schedule, and UGC creator briefs.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <CopyButton
            text={planMarkdown}
            label="Copy 7-Day Plan (Markdown)"
            copiedLabel="Playbook Copied!"
            size="md"
          />
        </div>
      </div>

      {/* 1. Trend Input Form */}
      <Card>
        <TrendInput onSubmit={handleGeneratePlan} isLoading={isLoading} />
      </Card>

      {/* 2. Sub-Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={(tab) => setActiveTab(tab as typeof activeTab)}
        tabs={[
          { id: 'adaptations', label: 'Format Adaptations', icon: <Flame className="w-4 h-4" /> },
          { id: 'calendar', label: '7-Day Editorial Calendar', icon: <Calendar className="w-4 h-4" /> },
          { id: 'creators', label: 'Creator Briefs', icon: <Users className="w-4 h-4" /> },
          { id: 'checklist', label: 'Virality Checklist', icon: <CheckCircle2 className="w-4 h-4" /> },
        ]}
      />

      {/* Tab 1: Format Adaptations */}
      {activeTab === 'adaptations' && (
        <div className="animate-in fade-in-50 duration-200">
          <AdaptationCards adaptations={viralPlan.trendAdaptations} />
        </div>
      )}

      {/* Tab 2: 7-Day Calendar */}
      {activeTab === 'calendar' && (
        <div className="animate-in fade-in-50 duration-200">
          <CalendarGrid calendar={viralPlan.calendar} />
        </div>
      )}

      {/* Tab 3: Creator Briefs */}
      {activeTab === 'creators' && (
        <div className="animate-in fade-in-50 duration-200">
          <CreatorBriefCard briefs={viralPlan.creatorBriefs} />
        </div>
      )}

      {/* Tab 4: Virality Checklist */}
      {activeTab === 'checklist' && (
        <div className="animate-in fade-in-50 duration-200">
          <ViralityChecklist checklist={viralPlan.viralityChecklist} />
        </div>
      )}
    </div>
  );
};

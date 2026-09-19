import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { Info, ArrowRight } from 'lucide-react';
import { calculateBudgetPlan, BudgetPlanSummary } from '@/lib/stats';
import { formatInr } from '@/lib/format';
import { Card } from '../ui/Card';

export const BudgetPlanner: React.FC = () => {
  const [dailyBudget, setDailyBudget] = useState(5000); // INR per day
  const [targetCpi, setTargetCpi] = useState(35); // INR per install
  const [variantCount, setVariantCount] = useState(4);
  const [phaseMode, setPhaseMode] = useState<'explore' | 'exploit'>('exploit');

  const plan: BudgetPlanSummary = calculateBudgetPlan(dailyBudget, targetCpi, variantCount);

  const activeAllocations =
    phaseMode === 'explore' ? plan.exploreAllocations : plan.exploitAllocations;

  const chartData = activeAllocations.map((a) => ({
    name: a.label,
    spend: a.dailySpend,
    share: `${a.sharePercent}%`,
    installs: a.estimatedInstalls,
  }));

  const barColors = ['#2F5BFF', '#7B4DFF', '#10B981', '#94A3B8'];

  return (
    <Card className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ECE9F8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold text-ink">
              Multi-Armed Bandit Budget Planner
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-purple bg-lavender-100 px-2 py-0.5 rounded-full">
              Explore / Exploit
            </span>
          </div>
          <p className="text-xs text-body mt-0.5">
            Deterministic allocation rules: Minimum test threshold = CPI x 15 installs, shifting to 70/20/10 exploit.
          </p>
        </div>

        {/* Phase Toggle */}
        <div className="inline-flex p-1 bg-lavender-100 rounded-xl border border-[#DDD8F5]">
          <button
            type="button"
            onClick={() => setPhaseMode('explore')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              phaseMode === 'explore'
                ? 'bg-white text-ink shadow-sm'
                : 'text-body hover:text-ink'
            }`}
          >
            Explore Phase (Equal)
          </button>
          <button
            type="button"
            onClick={() => setPhaseMode('exploit')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              phaseMode === 'exploit'
                ? 'bg-white text-brand-purple shadow-sm'
                : 'text-body hover:text-ink'
            }`}
          >
            Exploit Phase (70/20/10)
          </button>
        </div>
      </div>

      {/* Inputs Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-2xl bg-lavender-50/70 border border-[#ECE9F8]">
        {/* Daily Budget */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="dailyBudgetSlider" className="font-bold text-ink">
              Total Daily Budget
            </label>
            <span className="font-extrabold text-brand-purple font-mono">
              {formatInr(dailyBudget)}/day
            </span>
          </div>
          <input
            id="dailyBudgetSlider"
            type="range"
            min={1000}
            max={25000}
            step={500}
            value={dailyBudget}
            onChange={(e) => setDailyBudget(Number(e.target.value))}
            className="w-full accent-brand-purple cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-body">
            <span>₹1,000</span>
            <span>₹25,000</span>
          </div>
        </div>

        {/* Target CPI */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="targetCpiSlider" className="font-bold text-ink">
              Target CPI (Install Cost)
            </label>
            <span className="font-extrabold text-brand-blue font-mono">
              ₹{targetCpi}
            </span>
          </div>
          <input
            id="targetCpiSlider"
            type="range"
            min={15}
            max={80}
            step={1}
            value={targetCpi}
            onChange={(e) => setTargetCpi(Number(e.target.value))}
            className="w-full accent-brand-blue cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-body">
            <span>₹15 (Aggressive)</span>
            <span>₹80 (Conservative)</span>
          </div>
        </div>

        {/* Variant Count */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="variantsSlider" className="font-bold text-ink">
              Number of Creative Variants
            </label>
            <span className="font-extrabold text-ink font-mono">{variantCount} variants</span>
          </div>
          <input
            id="variantsSlider"
            type="range"
            min={3}
            max={6}
            step={1}
            value={variantCount}
            onChange={(e) => setVariantCount(Number(e.target.value))}
            className="w-full accent-ink cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-body">
            <span>3 variants</span>
            <span>6 variants</span>
          </div>
        </div>
      </div>

      {/* Summary Stat Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-3.5 rounded-2xl bg-white border border-[#ECE9F8] shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-body">Min Spend / Variant</span>
          <div className="text-base font-extrabold text-ink font-mono">
            {formatInr(plan.minTestBudgetPerVariant)}
          </div>
          <span className="text-[10px] text-body">Target CPI x 15 installs</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#ECE9F8] shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-body">Total Explore Spend</span>
          <div className="text-base font-extrabold text-ink font-mono">
            {formatInr(plan.totalExploreBudgetNeeded)}
          </div>
          <span className="text-[10px] text-body">Required across all {variantCount}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#ECE9F8] shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-body">Days to Significance</span>
          <div className="text-base font-extrabold text-[#6D4AFF] font-mono">
            ~{plan.daysToCompleteExplore} Days
          </div>
          <span className="text-[10px] text-body">At {formatInr(dailyBudget)}/day rate</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#ECE9F8] shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-body">Est. Daily Installs</span>
          <div className="text-base font-extrabold text-brand-success font-mono">
            ~{Math.round(dailyBudget / targetCpi)} installs
          </div>
          <span className="text-[10px] text-body">Targeting ₹{targetCpi} CPI</span>
        </div>
      </div>

      {/* Recharts Budget Allocation Chart */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-body">
            Daily Budget Allocation ({phaseMode.toUpperCase()} PHASE)
          </span>
          <span className="text-[11px] text-body">Amounts in INR / day</span>
        </div>

        <div className="h-48 w-full bg-white p-2 rounded-2xl border border-[#ECE9F8]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#5B6478' }} interval={0} />
              <YAxis tick={{ fontSize: 11, fill: '#5B6478' }} />
              <Tooltip
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Daily Spend']}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #ECE9F8',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="spend" radius={[8, 8, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rules in Plain Language */}
      <div className="p-4 rounded-2xl bg-lavender-50 border border-[#ECE9F8] space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-brand-purple" />
          <span>Multi-Armed Bandit Rules Explained</span>
        </div>
        <ul className="space-y-1.5 text-xs text-body">
          {plan.rulesExplanation.map((rule, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <ArrowRight className="w-3.5 h-3.5 text-brand-purple shrink-0 mt-0.5" />
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

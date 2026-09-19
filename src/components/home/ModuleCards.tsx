import React from 'react';
import { Link } from 'react-router-dom';
import {
  Clapperboard,
  TrendingUp,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { Card } from '../ui/Card';

export const ModuleCards: React.FC = () => {
  const modules = [
    {
      id: 'content',
      tag: 'STAGE 1 • CONTENT',
      title: 'Content Studio',
      jdPillar: 'JD 1: Content Generation (Scripts, Visuals, Videos)',
      description:
        'Turns real learner anxiety into 15 scroll-stopping hooks, rigorous rubric evaluations, 15-second timed scripts, and an animated Reel preview with Arya.',
      icon: <Clapperboard className="w-5 h-5 text-brand-blue" />,
      tileBg: 'bg-pastel-indigo',
      link: '/studio',
      badge: 'Hero Pipeline',
      actionText: 'Open Content Studio',
      flowPills: ['Pain Point', '15 Hooks', 'Scoring', '15s Reel'],
    },
    {
      id: 'ads',
      tag: 'STAGE 2 • ADS',
      title: 'Ad Lab',
      jdPillar: 'JD 2: Paid Marketing Efficiency & Analytical Rigor',
      description:
        'Transforms validated hooks into disciplined Meta ad matrices. A pure TypeScript statistical engine runs two-proportion z-tests for Scale, Test, or Kill verdicts.',
      icon: <TrendingUp className="w-5 h-5 text-brand-purple" />,
      tileBg: 'bg-pastel-pink',
      link: '/ads',
      badge: 'Z-Test Engine',
      actionText: 'Open Ad Lab',
      flowPills: ['Creative Matrix', 'Explore / Exploit', 'Z-Score Analysis', 'Scale Decisions'],
    },
    {
      id: 'viral',
      tag: 'STAGE 3 • ORGANIC',
      title: 'Viral Lab',
      jdPillar: 'JD 3: Organic Growth & Creator Playbooks',
      description:
        'Adapts viral social video formats into relatable English learning hooks, generates a 7-day multi-format calendar, and drafts briefs for MySivi’s "Become a Creator" program.',
      icon: <Flame className="w-5 h-5 text-amber-600" />,
      tileBg: 'bg-pastel-amber',
      link: '/viral',
      badge: 'Creator Briefs',
      actionText: 'Open Viral Lab',
      flowPills: ['Format Adaptation', '7-Day Mix', 'Creator Briefs', 'Virality Heuristics'],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Visual OS Connective Flow Header */}
      <div className="flex flex-col items-center justify-center text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#ECE9F8] shadow-sm text-xs font-bold text-body">
          <span className="w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
          <span>The Growth Operating System</span>
        </div>
        <p className="text-xs sm:text-sm font-medium text-body max-w-xl">
          <span className="font-semibold text-ink">Learner problem</span> → AI insight → content → experiment → measurement → iteration
        </p>
      </div>

      {/* Connected 3 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {modules.map((m) => (
          <Link key={m.id} to={m.link} className="group focus:outline-none">
            <Card
              padded={false}
              className="h-full flex flex-col p-6 border-[#ECE9F8] hover:border-brand-purple/40 hover:shadow-soft transition-all duration-300 group-hover:-translate-y-1 relative bg-white/95"
            >
              {/* Header with Tile & Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 rounded-2xl ${m.tileBg} flex items-center justify-center shadow-sm`}>
                  {m.icon}
                </div>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-lavender-100 text-brand-purple border border-[#DDD8F5]">
                  {m.badge}
                </span>
              </div>

              {/* Tag & Title */}
              <div className="space-y-1 mb-2">
                <span className="text-[10px] font-extrabold tracking-widest text-[#6D4AFF] uppercase">
                  {m.tag}
                </span>
                <h3 className="text-xl font-extrabold text-ink group-hover:text-[#2F5BFF] transition-colors flex items-center justify-between">
                  {m.title}
                  <ArrowRight className="w-4 h-4 text-body/40 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
                </h3>
              </div>

              {/* JD Mapping Note */}
              <div className="text-[11px] font-semibold text-brand-purple/90 bg-lavender-50 px-2.5 py-1 rounded-lg border border-[#ECE9F8] mb-3">
                {m.jdPillar}
              </div>

              {/* Description */}
              <p className="text-xs text-body leading-relaxed flex-1 mb-4">
                {m.description}
              </p>

              {/* Mini Flow Pills */}
              <div className="pt-3 border-t border-[#ECE9F8] flex flex-wrap gap-1.5 mb-4">
                {m.flowPills.map((pill, pIdx) => (
                  <span
                    key={pIdx}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-lavender-50 text-body border border-[#ECE9F8]"
                  >
                    {pill}
                  </span>
                ))}
              </div>

              {/* Action Link Button */}
              <div className="pt-1 flex items-center text-xs font-bold text-[#6D4AFF] group-hover:text-[#2F5BFF] transition-colors">
                <span>{m.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

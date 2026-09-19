import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Play, CheckCircle2 } from 'lucide-react';
import { HeroBackdrop } from '@/components/home/HeroBackdrop';
import { StatRow } from '@/components/home/StatRow';
import { ModuleCards } from '@/components/home/ModuleCards';
import { Button } from '@/components/ui/Button';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleRunExperiment = () => {
    // Immediately opens preconfigured Content Studio example
    navigate('/studio?sample=true&autoRun=true');
  };

  const handleSeeHowItWorks = () => {
    const el = document.getElementById('growth-modules');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Hero Section — The 30 Second Test */}
      <section className="relative pt-6 pb-12 sm:pt-14 sm:pb-20 flex flex-col items-center text-center">
        {/* Floating cards backdrop matching mysivi.ai */}
        <HeroBackdrop />

        {/* Top Eyebrow Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#ECE9F8] shadow-sm mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="w-2 h-2 rounded-full bg-brand-purple animate-ping" />
          <span className="text-[11px] font-black uppercase tracking-widest text-[#6D4AFF]">
            GROWTH LAB
          </span>
          <span className="text-body/60 text-xs">•</span>
          <span className="text-[11px] font-semibold text-body">
            AI Growth Workspace for MySivi
          </span>
        </div>

        {/* Big Headline with Indigo-Violet Gradient Words */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-ink tracking-tight max-w-4xl leading-[1.1] sm:leading-[1.12]">
          From learner pain to{' '}
          <span className="text-gradient">growth experiment.</span>
        </h1>

        {/* Supporting Line */}
        <p className="mt-5 text-base sm:text-xl text-body max-w-2xl font-normal leading-relaxed">
          An AI growth workspace I built to explore how learner insights can become content, campaigns and measurable experiments.
        </p>

        {/* Primary & Secondary CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button
            variant="primary"
            size="lg"
            onClick={handleRunExperiment}
            icon={<Sparkles className="w-4 h-4 text-white animate-pulse" />}
            className="w-full sm:w-auto text-base px-8 py-4"
          >
            Run a growth experiment
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={handleSeeHowItWorks}
            icon={<Play className="w-4 h-4 fill-[#6D4AFF]" />}
            className="w-full sm:w-auto text-base px-6 py-4"
          >
            See how it works
          </Button>
        </div>

        {/* Honesty note under hero */}
        <div className="mt-4 text-[11px] text-body/80 flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-brand-success" />
          <span>1-click instant demo • 100% free tier • No API key required to test</span>
        </div>

        {/* Stats Row in exact layout of mysivi.ai */}
        <div className="mt-12 sm:mt-16 w-full flex justify-center">
          <StatRow />
        </div>
      </section>

      {/* 2. Three Modules: Content -> Ads -> Organic */}
      <section id="growth-modules" className="pt-6">
        <ModuleCards />
      </section>
    </div>
  );
};

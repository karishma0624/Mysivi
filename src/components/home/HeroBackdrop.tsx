import React from 'react';
import { Flame, BookOpen, GraduationCap, PhoneCall, CheckCircle2 } from 'lucide-react';
import { ScoreRing } from '../ui/ScoreRing';
import { Waveform } from '../ui/Waveform';

export const HeroBackdrop: React.FC = () => {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none opacity-40 lg:opacity-75"
      aria-hidden="true"
    >
      {/* 1. Left Top: Daily Streak Card */}
      <div className="absolute top-12 left-4 xl:left-12 bg-white/80 backdrop-blur-sm border border-[#ECE9F8] rounded-2xl p-3 shadow-card animate-float hidden md:flex items-center gap-3 w-52">
        <div className="w-10 h-10 rounded-xl bg-pastel-amber flex items-center justify-center text-amber-500 shrink-0">
          <Flame className="w-5 h-5 fill-amber-500" />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-body font-medium">Daily Goal</span>
            <span className="text-[9px] font-bold text-brand-purple bg-lavender-100 px-1.5 py-0.2 rounded">sample</span>
          </div>
          <div className="text-sm font-extrabold text-ink">21 Day Streak</div>
        </div>
      </div>

      {/* 2. Left Middle: Arya AI Chat Bubble */}
      <div className="absolute top-48 left-2 xl:left-8 bg-white/85 backdrop-blur-md border border-[#ECE9F8] rounded-[20px] p-4 shadow-card animate-float-slow hidden lg:block w-64">
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center text-white text-xs font-bold">
            A
          </div>
          <div>
            <div className="text-xs font-bold text-ink flex items-center gap-1">
              Arya <span className="text-[9px] font-semibold text-brand-purple">AI Teacher</span>
            </div>
            <div className="text-[10px] text-body">Active spoken session</div>
          </div>
        </div>
        <div className="p-2.5 bg-lavender-50 rounded-xl border border-[#ECE9F8] text-[11px] text-ink leading-relaxed">
          "Hi there! What would you like to practice today?"
        </div>
        <div className="mt-2 flex items-center justify-between pt-1">
          <Waveform active barCount={16} height={16} />
          <span className="text-[10px] font-mono text-body">00:12</span>
        </div>
      </div>

      {/* 3. Left Bottom: Grammar Check with Score Ring 88 */}
      <div className="absolute bottom-16 left-6 xl:left-16 bg-white/80 backdrop-blur-sm border border-[#ECE9F8] rounded-2xl p-3.5 shadow-card animate-float hidden xl:flex items-center gap-3">
        <ScoreRing score={88} size={48} strokeWidth={4} />
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-ink">Grammar Check</span>
            <span className="text-[9px] font-bold text-brand-purple bg-lavender-100 px-1.5 py-0.2 rounded">sample</span>
          </div>
          <span className="text-[11px] text-brand-success font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Great! Fluency +12%
          </span>
        </div>
      </div>

      {/* 4. Right Top: Active Call Card */}
      <div className="absolute top-16 right-4 xl:right-14 bg-white/80 backdrop-blur-sm border border-[#ECE9F8] rounded-2xl p-3 shadow-card animate-float hidden md:flex items-center gap-3 w-56">
        <div className="w-10 h-10 rounded-xl bg-pastel-indigo flex items-center justify-center text-brand-blue shrink-0">
          <PhoneCall className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-body">Peer Practice Call</span>
            <span className="text-[10px] font-mono text-brand-blue font-bold">04:32</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <Waveform active barCount={12} height={12} />
            <span className="text-[9px] text-body/80 ml-auto">sample</span>
          </div>
        </div>
      </div>

      {/* 5. Right Middle: Quote / Community Card */}
      <div className="absolute top-52 right-2 xl:right-8 bg-white/85 backdrop-blur-md border border-[#ECE9F8] rounded-[20px] p-4 shadow-card animate-float-slow hidden lg:block w-60">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-pastel-mint flex items-center justify-center text-brand-success">
            <GraduationCap className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-ink">Active Community</span>
        </div>
        <div className="text-lg font-black text-ink">500K+</div>
        <div className="text-[11px] text-body">Learners practicing worldwide</div>
        <div className="mt-2.5 pt-2 border-t border-[#ECE9F8] text-[10px] italic text-body/90">
          "Practice today, Fluent tomorrow."
        </div>
      </div>

      {/* 6. Right Bottom: Vocabulary Card */}
      <div className="absolute bottom-14 right-6 xl:right-16 bg-white/80 backdrop-blur-sm border border-[#ECE9F8] rounded-2xl p-3.5 shadow-card animate-float hidden xl:flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-pastel-pink flex items-center justify-center text-pink-500 shrink-0">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-body">New Words Learned</span>
            <span className="text-[9px] font-bold text-brand-purple bg-lavender-100 px-1 py-0.2 rounded">sample</span>
          </div>
          <div className="text-xs font-bold text-ink">15 professional phrases</div>
        </div>
      </div>
    </div>
  );
};

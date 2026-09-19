import React, { useState } from 'react';
import { Video, Terminal, Camera, Clapperboard, Sparkles } from 'lucide-react';
import { VideoShotPrompt } from '@shared/types';
import { CopyButton } from '../ui/CopyButton';
import { generateVideoPromptsText } from '@/lib/export';

interface VideoPromptPackProps {
  prompts: VideoShotPrompt[];
}

export const VideoPromptPack: React.FC<VideoPromptPackProps> = ({ prompts }) => {
  const [selectedShotIndex, setSelectedShotIndex] = useState(0);

  const currentPrompt = prompts[selectedShotIndex] || prompts[0];
  const allPromptsText = generateVideoPromptsText(prompts);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ECE9F8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold text-ink">Text-to-Video Prompt Pack</h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-purple bg-lavender-100 px-2 py-0.5 rounded-full">
              Veo / Runway Ready
            </span>
          </div>
          <p className="text-xs text-body mt-0.5">
            Production-grade generative prompts with camera direction, physics motion, lighting cues, and negative tokens.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CopyButton text={allPromptsText} label="Copy All 4 Prompts" size="sm" />
        </div>
      </div>

      {/* Label note */}
      <div className="p-3 bg-lavender-50 rounded-xl border border-[#ECE9F8] text-xs text-body flex items-center gap-2">
        <Terminal className="w-4 h-4 text-brand-purple shrink-0" />
        <span>
          <strong>Paste into Veo, Runway Gen-3 or Kling:</strong> These prompts are calibrated for high-fidelity 9:16 vertical motion without uncanny artifacts.
        </span>
      </div>

      {/* Shot Tabs */}
      <div className="flex flex-wrap gap-2">
        {prompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedShotIndex(idx)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              selectedShotIndex === idx
                ? 'bg-brand-purple text-white border-brand-purple shadow-sm'
                : 'bg-white text-body border-[#ECE9F8] hover:bg-lavender-50'
            }`}
          >
            {p.shot}
          </button>
        ))}
      </div>

      {/* Shot Prompt Details Card */}
      {currentPrompt && (
        <div className="bg-white rounded-2xl border border-[#ECE9F8] p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clapperboard className="w-4 h-4 text-brand-purple" />
              <h4 className="text-sm font-extrabold text-ink">{currentPrompt.shot}</h4>
              <span className="text-[11px] font-mono text-body/80 bg-lavender-50 px-2 py-0.5 rounded-md">
                {currentPrompt.duration}
              </span>
            </div>
            <CopyButton text={currentPrompt.prompt} label="Copy Shot Prompt" size="sm" />
          </div>

          {/* Main Prompt */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-body">
              Generative Video Prompt
            </span>
            <div className="p-3.5 rounded-xl bg-lavender-50/80 border border-[#ECE9F8] font-mono text-xs text-ink leading-relaxed">
              {currentPrompt.prompt}
            </div>
          </div>

          {/* Parameters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white border border-[#ECE9F8] space-y-1">
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-body">
                <Camera className="w-3 h-3 text-brand-blue" />
                <span>Camera Direction</span>
              </div>
              <p className="text-body font-medium">{currentPrompt.camera}</p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#ECE9F8] space-y-1">
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-body">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Lighting & Grade</span>
              </div>
              <p className="text-body font-medium">{currentPrompt.lighting}</p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#ECE9F8] space-y-1">
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-body">
                <Video className="w-3 h-3 text-brand-purple" />
                <span>Subject Motion</span>
              </div>
              <p className="text-body font-medium">{currentPrompt.motion}</p>
            </div>
          </div>

          {/* Negative Prompt */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-body">
              Negative Prompt (Universal Artifact Suppression)
            </span>
            <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-100 font-mono text-[11px] text-rose-800">
              {currentPrompt.negativePrompt}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

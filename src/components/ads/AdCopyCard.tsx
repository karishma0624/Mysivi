import React from 'react';
import { AdVariant } from '@shared/types';
import { CopyButton } from '../ui/CopyButton';

interface AdCopyCardProps {
  variant: AdVariant;
  isControl?: boolean;
}

export const RECOMMENDED_LIMITS = {
  PRIMARY_TEXT: 125,
  HEADLINE: 40,
  DESCRIPTION: 30,
} as const;

export const AdCopyCard: React.FC<AdCopyCardProps> = ({ variant, isControl = false }) => {
  const primaryLen = variant.primaryText.length;
  const headlineLen = variant.headline.length;
  const descLen = variant.description.length;

  return (
    <div className="bg-white border border-[#ECE9F8] rounded-[22px] p-5 sm:p-6 shadow-card flex flex-col justify-between space-y-4 hover:border-brand-purple/30 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 border-b border-[#ECE9F8] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                isControl
                  ? 'bg-lavender-100 text-brand-purple border-[#DDD8F5]'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              {isControl ? 'Control Baseline' : 'Creative Variant'}
            </span>
            <span className="text-[11px] font-medium text-body">{variant.angle}</span>
          </div>
          <h4 className="text-base font-extrabold text-ink mt-1">{variant.variantName}</h4>
        </div>

        <CopyButton
          text={`Headline: ${variant.headline}\nPrimary Text: ${variant.primaryText}\nDescription: ${variant.description}\nCTA: ${variant.ctaType}`}
          label="Copy Ad"
          size="sm"
        />
      </div>

      {/* Meta Ad Mockup Box */}
      <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-[#E5E7EB] space-y-3 font-sans">
        {/* Brand Meta Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center text-white text-xs font-bold shadow-sm">
            M
          </div>
          <div>
            <div className="text-xs font-bold text-ink flex items-center gap-1">
              MySivi • Spoken English
              <span className="text-[9px] text-body/70 font-normal">Sponsored</span>
            </div>
            <div className="text-[10px] text-body">Target: {variant.audience}</div>
          </div>
        </div>

        {/* Primary Text */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-bold uppercase text-body">Primary Text</span>
            <span
              className={`font-mono font-semibold ${
                primaryLen > RECOMMENDED_LIMITS.PRIMARY_TEXT ? 'text-amber-600' : 'text-body'
              }`}
            >
              {primaryLen}/{RECOMMENDED_LIMITS.PRIMARY_TEXT} chars
            </span>
          </div>
          <p className="text-xs text-ink leading-relaxed font-normal">
            {variant.primaryText}
          </p>
        </div>

        {/* Feed Ad Creative Bottom Card */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-3 flex items-center justify-between gap-3 shadow-xs">
          <div className="space-y-0.5 flex-1 min-w-0">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-[9px] font-bold text-body/70 uppercase">Headline</span>
              <span className="font-mono text-[9px] text-body">{headlineLen}/{RECOMMENDED_LIMITS.HEADLINE}</span>
            </div>
            <div className="text-xs font-bold text-ink truncate">{variant.headline}</div>
            <div className="text-[11px] text-body truncate">
              {variant.description} ({descLen}/{RECOMMENDED_LIMITS.DESCRIPTION})
            </div>
          </div>

          <button
            type="button"
            className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg bg-[#F0EEFF] text-[#6D4AFF] border border-[#DDD8F5] select-none"
          >
            {variant.ctaType || 'Download'}
          </button>
        </div>
      </div>

      {/* Target Persona Footer */}
      <div className="text-[11px] text-body flex items-center justify-between pt-1">
        <span>Hook: "{variant.hook}"</span>
      </div>
    </div>
  );
};

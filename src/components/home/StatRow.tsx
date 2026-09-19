import React from 'react';
import { BRAND_FACTS } from '@shared/brandFacts';

export const StatRow: React.FC = () => {
  const { downloads, languages, rating } = BRAND_FACTS.metrics;

  return (
    <div className="inline-flex items-center justify-center bg-white/85 backdrop-blur-md border border-[#ECE9F8] rounded-[22px] px-6 py-4 shadow-card divide-x divide-[#ECE9F8]">
      {/* Downloads */}
      <div className="px-4 sm:px-6 text-center">
        <div className="text-xl sm:text-2xl font-black tracking-tight text-ink">
          {downloads.value}
        </div>
        <div className="text-[11px] font-semibold text-body/90 mt-0.5">
          {downloads.label}
        </div>
      </div>

      {/* Languages */}
      <div className="px-4 sm:px-6 text-center">
        <div className="text-xl sm:text-2xl font-black tracking-tight text-ink">
          {languages.value}
        </div>
        <div className="text-[11px] font-semibold text-body/90 mt-0.5">
          {languages.label}
        </div>
      </div>

      {/* Rating */}
      <div className="px-4 sm:px-6 text-center">
        <div className="text-xl sm:text-2xl font-black tracking-tight text-ink flex items-center justify-center gap-0.5">
          <span>4.7</span>
          <span className="text-[#12A36B] text-lg">★</span>
        </div>
        <div className="text-[11px] font-semibold text-body/90 mt-0.5">
          {rating.label}
        </div>
      </div>
    </div>
  );
};

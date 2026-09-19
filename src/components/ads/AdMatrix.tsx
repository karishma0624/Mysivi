import React from 'react';
import { AdVariant } from '@shared/types';
import { AdCopyCard } from './AdCopyCard';

interface AdMatrixProps {
  variants: AdVariant[];
}

export const AdMatrix: React.FC<AdMatrixProps> = ({ variants }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ECE9F8] pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-ink">
            Meta Ads Copy Matrix
          </h3>
          <p className="text-xs text-body mt-0.5">
            Hook x Angle x Audience permutations formatted for mobile feed truncation thresholds.
          </p>
        </div>

        <div className="text-xs font-semibold text-body bg-lavender-100 px-3 py-1.5 rounded-xl border border-[#DDD8F5]">
          Truncation Limits: Primary 125 • Headline 40 • Desc 30
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {variants.map((variant, idx) => (
          <AdCopyCard key={variant.id || idx} variant={variant} isControl={idx === 0} />
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const DisclosureBar: React.FC = () => {
  return (
    <div className="bg-[#ECE9F8]/60 border-b border-[#DDD8F5]/60 text-[11px] text-body py-1.5 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-semibold text-[#6D4AFF]">
            <ShieldCheck className="w-3.5 h-3.5" />
            Proof of Work Prototype:
          </span>
          <span>
            Unofficial prototype built by S K Karishma for MySivi application • Not affiliated with MySivi • Site facts as displayed on mysivi.ai
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-4 text-[10px] text-body/80">
          <span className="flex items-center gap-1">
            <Info className="w-3 h-3" />
            Scores are AI-predicted from a rubric, not real campaign data
          </span>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { PromptViewer } from '@/components/prompts/PromptViewer';

export const PromptLibrary: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Module Header */}
      <div className="border-b border-[#ECE9F8] pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6D4AFF] bg-lavender-100 px-2.5 py-0.5 rounded-full border border-[#DDD8F5]">
            ENGINE ROOM • PROMPT ARCHITECTURE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          Prompt Engineering System Architecture
        </h1>
        <p className="text-xs sm:text-sm text-body mt-1 max-w-3xl leading-relaxed">
          Not just simple text prompts: A systematic architecture of isolated agent roles, strict &lt;&lt;&lt;DATA&gt;&gt;&gt; injection delimiters, Zod schemas, self-checking instructions, and few-shot calibration.
        </p>
      </div>

      {/* Main Interactive Viewer */}
      <PromptViewer />
    </div>
  );
};

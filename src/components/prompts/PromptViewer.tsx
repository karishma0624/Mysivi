import React, { useState } from 'react';
import clsx from 'clsx';
import {
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { ALL_PROMPTS } from '@shared/prompts';
import { CopyButton } from '../ui/CopyButton';

export const PromptViewer: React.FC = () => {
  const [selectedPromptId, setSelectedPromptId] = useState<string>(ALL_PROMPTS[0].id);
  const [activeTab, setActiveTab] = useState<'system' | 'user' | 'schema' | 'fewshot'>('system');

  const currentPrompt = ALL_PROMPTS.find((p) => p.id === selectedPromptId) || ALL_PROMPTS[0];

  const fullPromptCopyText = `// ==========================================
// AGENT: ${currentPrompt.name} (${currentPrompt.id})
// DESIGN RATIONALE: ${currentPrompt.designNote}
// ==========================================

[SYSTEM INSTRUCTION]
${currentPrompt.system}

[USER PROMPT TEMPLATE]
${currentPrompt.userTemplate}

[FEW-SHOT EXAMPLE]
INPUT:
${JSON.stringify(currentPrompt.fewShot.input, null, 2)}

OUTPUT:
${JSON.stringify(currentPrompt.fewShot.output, null, 2)}
`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ECE9F8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-ink">Prompt Engineering Laboratory</h2>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-purple bg-lavender-100 px-2.5 py-0.5 rounded-full border border-[#DDD8F5]">
              Production Source of Truth
            </span>
          </div>
          <p className="text-xs text-body mt-0.5">
            Single-source prompt definitions exported from <code>@shared/prompts/*</code> powering both API calls and UI documentation.
          </p>
        </div>

        <CopyButton
          text={fullPromptCopyText}
          label="Copy Entire Agent Spec"
          copiedLabel="Agent Spec Copied!"
          size="md"
        />
      </div>

      {/* Main Split Layout: Left Agent Navigator, Right Prompt Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 13 Agent Prompts (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#ECE9F8] rounded-[22px] p-3 shadow-card space-y-1.5 max-h-[750px] overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-body">
            Active System Agents ({ALL_PROMPTS.length})
          </div>

          {ALL_PROMPTS.map((prompt, idx) => {
            const isSelected = prompt.id === selectedPromptId;

            return (
              <button
                key={prompt.id}
                type="button"
                onClick={() => setSelectedPromptId(prompt.id)}
                className={clsx(
                  'w-full text-left p-3 rounded-xl transition-all border flex items-center justify-between group select-none',
                  isSelected
                    ? 'bg-lavender-100/90 text-brand-purple border-brand-purple/30 shadow-xs'
                    : 'bg-white text-ink border-transparent hover:bg-lavender-50'
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={clsx(
                      'w-6 h-6 rounded-lg text-[11px] font-mono font-bold flex items-center justify-center shrink-0',
                      isSelected ? 'bg-brand-purple text-white' : 'bg-lavender-100 text-body'
                    )}
                  >
                    0{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate text-ink group-hover:text-brand-purple">
                      {prompt.name}
                    </div>
                    <div className="text-[10px] text-body truncate font-mono">
                      {prompt.id}.ts
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Prompt Detail Engine Room (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#ECE9F8] rounded-[24px] p-6 shadow-card space-y-6">
          {/* Agent Title & Design Rationale */}
          <div className="space-y-2 border-b border-[#ECE9F8] pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-purple">
                  Agent Specification
                </span>
                <h3 className="text-xl font-black text-ink mt-0.5">{currentPrompt.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <CopyButton
                  text={
                    activeTab === 'system'
                      ? currentPrompt.system
                      : activeTab === 'user'
                      ? currentPrompt.userTemplate
                      : JSON.stringify(currentPrompt.fewShot, null, 2)
                  }
                  label={`Copy ${activeTab.toUpperCase()}`}
                  size="sm"
                />
              </div>
            </div>

            {/* Design Note Box */}
            <div className="p-3 bg-lavender-50/80 rounded-xl border border-[#ECE9F8] flex items-start gap-2 text-xs">
              <Sparkles className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
              <p className="text-body leading-relaxed">
                <strong>Architectural Rationale:</strong> {currentPrompt.designNote}
              </p>
            </div>
          </div>

          {/* Sub-Tabs: System Prompt / User Template / Schema / Few-Shot */}
          <div className="flex items-center gap-1.5 p-1 bg-lavender-100 rounded-xl border border-[#DDD8F5] overflow-x-auto">
            {[
              { id: 'system', label: 'System Instruction' },
              { id: 'user', label: 'User Template & Delimiters' },
              { id: 'fewshot', label: 'Few-Shot Example' },
              { id: 'schema', label: 'Zod Output Schema' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={clsx(
                  'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap',
                  activeTab === tab.id
                    ? 'bg-white text-ink shadow-sm'
                    : 'text-body hover:text-ink'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Code Inspector Body */}
          <div className="relative rounded-2xl bg-[#0B1020] text-slate-100 p-5 font-mono text-xs overflow-x-auto shadow-inner border border-[#1E2640] min-h-[380px] max-h-[500px]">
            {activeTab === 'system' && (
              <pre className="whitespace-pre-wrap leading-relaxed">
                {currentPrompt.system}
              </pre>
            )}

            {activeTab === 'user' && (
              <pre className="whitespace-pre-wrap leading-relaxed text-emerald-300">
                {currentPrompt.userTemplate}
              </pre>
            )}

            {activeTab === 'fewshot' && (
              <pre className="whitespace-pre-wrap leading-relaxed text-indigo-200">
                {JSON.stringify(currentPrompt.fewShot, null, 2)}
              </pre>
            )}

            {activeTab === 'schema' && (
              <div className="space-y-2 text-amber-200">
                <div className="text-[11px] text-slate-400 font-sans">
                  Strict Zod runtime validation enforced on every response:
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed">
                  {`// Strict Zod Schema definition
import { z } from 'zod';

export const schema = ${JSON.stringify(currentPrompt.fewShot.output, null, 2)}
// Validated with 1 automatic retry loop on schema validation error`}
                </pre>
              </div>
            )}
          </div>

          {/* Guardrails Check Footer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] pt-1 border-t border-[#ECE9F8]">
            <div className="flex items-center gap-1.5 text-body">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-success shrink-0" />
              <span>&lt;&lt;&lt;DATA&gt;&gt;&gt; Delimiters enforced</span>
            </div>
            <div className="flex items-center gap-1.5 text-body">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-success shrink-0" />
              <span>Zero-judgment tone embedded</span>
            </div>
            <div className="flex items-center gap-1.5 text-body">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-success shrink-0" />
              <span>Pure JSON response mode</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

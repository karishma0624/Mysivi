import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import {
  Sparkles,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { ALL_PROMPTS } from '@shared/prompts';
import { CopyButton } from '../ui/CopyButton';
import { AGENT_BASE_URL } from '@/hooks/useAgentStream';

export const PromptViewer: React.FC = () => {
  const [promptsList, setPromptsList] = useState<any[]>(ALL_PROMPTS);
  const [isPythonLive, setIsPythonLive] = useState(false);
  const [selectedPromptId, setSelectedPromptId] = useState<string>(ALL_PROMPTS[0].id);
  const [activeTab, setActiveTab] = useState<'system' | 'user' | 'schema' | 'fewshot'>('system');

  useEffect(() => {
    let isMounted = true;
    async function fetchPrompts() {
      try {
        const res = await fetch(`${AGENT_BASE_URL}/prompts`, {
          signal: AbortSignal.timeout(3000),
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.prompts && Array.isArray(data.prompts) && data.prompts.length > 0) {
            setPromptsList(data.prompts);
            setIsPythonLive(true);
            setSelectedPromptId(data.prompts[0].id);
          }
        }
      } catch {
        // Fall back gracefully to local prompts definitions
        setIsPythonLive(false);
      }
    }
    fetchPrompts();
    return () => {
      isMounted = false;
    };
  }, []);

  const currentPrompt =
    promptsList.find((p) => p.id === selectedPromptId) || promptsList[0] || ALL_PROMPTS[0];

  const fullPromptCopyText = `// ==========================================
// AGENT: ${currentPrompt.name} (${currentPrompt.id})
// DESIGN RATIONALE: ${currentPrompt.designNote || ''}
// ==========================================

[SYSTEM INSTRUCTION]
${currentPrompt.system || ''}

[USER PROMPT TEMPLATE]
${currentPrompt.userTemplate || ''}

[FEW-SHOT EXAMPLE]
${currentPrompt.fewShot ? JSON.stringify(currentPrompt.fewShot, null, 2) : 'N/A'}
`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ECE9F8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-ink">Prompt Engineering Laboratory</h2>
            {isPythonLive ? (
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-emerald-600" />
                Python Agent Prompts (agent/app/prompts/*)
              </span>
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-purple bg-lavender-100 px-2.5 py-0.5 rounded-full border border-[#DDD8F5]">
                Single Source of Truth
              </span>
            )}
          </div>
          <p className="text-xs text-body mt-0.5">
            {isPythonLive
              ? 'Serving live production system prompts directly from the LangGraph agent backend (GET /prompts).'
              : 'Single-source prompt definitions exported from @shared/prompts/* powering both API calls and UI documentation.'}
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
        {/* Left Column: Agent Prompts (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#ECE9F8] rounded-[22px] p-3 shadow-card space-y-1.5 max-h-[750px] overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-body flex items-center justify-between">
            <span>Active System Agents ({promptsList.length})</span>
            {isPythonLive && (
              <span className="text-[9px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                Live Backend
              </span>
            )}
          </div>

          {promptsList.map((prompt, idx) => {
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
                      {prompt.id}.{isPythonLive ? 'py' : 'ts'}
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
                  Agent Specification {isPythonLive && '• LangGraph Node'}
                </span>
                <h3 className="text-xl font-black text-ink mt-0.5">{currentPrompt.name}</h3>
                {currentPrompt.role && (
                  <p className="text-xs text-body mt-0.5 font-medium">{currentPrompt.role}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <CopyButton
                  text={
                    activeTab === 'system'
                      ? currentPrompt.system || ''
                      : activeTab === 'user'
                      ? currentPrompt.userTemplate || ''
                      : JSON.stringify(currentPrompt.fewShot, null, 2)
                  }
                  label={`Copy ${activeTab.toUpperCase()}`}
                  size="sm"
                />
              </div>
            </div>

            {/* Design Note Box */}
            {currentPrompt.designNote && (
              <div className="p-3 bg-lavender-50/80 rounded-xl border border-[#ECE9F8] flex items-start gap-2 text-xs">
                <Sparkles className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
                <p className="text-body leading-relaxed">
                  <strong>Architectural Rationale:</strong> {currentPrompt.designNote}
                </p>
              </div>
            )}
          </div>

          {/* Sub-Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-lavender-100 rounded-xl border border-[#DDD8F5] overflow-x-auto">
            {[
              { id: 'system', label: 'System Instruction' },
              { id: 'user', label: 'User Template & Delimiters' },
              { id: 'fewshot', label: 'Few-Shot Calibration' },
              { id: 'schema', label: 'Structured Schema' },
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
                {currentPrompt.fewShot
                  ? JSON.stringify(currentPrompt.fewShot, null, 2)
                  : '// Few-shot calibration embedded in system instruction.'}
              </pre>
            )}

            {activeTab === 'schema' && (
              <div className="space-y-2 text-amber-200">
                <div className="text-[11px] text-slate-400 font-sans">
                  Structured Pydantic / Zod runtime validation enforced on every response:
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed">
                  {currentPrompt.fewShot?.output
                    ? `// Validated schema definition:\n${JSON.stringify(currentPrompt.fewShot.output, null, 2)}`
                    : `// Model output validated with strict Pydantic OutputModel.\n// Automatic fallback on 429/503 rate limits.`}
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
              <span>Structured JSON response mode</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

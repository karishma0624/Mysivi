import React, { useState } from 'react';
import clsx from 'clsx';
import {
  CheckCircle2,
  Loader2,
  GitFork,
  RotateCcw,
  UserCheck,
  ShieldCheck,
  FileCode2,
  ChevronDown,
  ChevronUp,
  Cpu,
} from 'lucide-react';
import { NodeState, AgentNodeId } from '@/hooks/useAgentStream';

interface AgentGraphProps {
  nodes: NodeState[];
  activeNode: AgentNodeId | null;
  revisionCount: number;
  isFinished: boolean;
  isSampleReplay?: boolean;
}

export const AgentGraph: React.FC<AgentGraphProps> = ({
  nodes,
  activeNode,
  revisionCount,
  isFinished,
  isSampleReplay = false,
}) => {
  const [showArchitecture, setShowArchitecture] = useState(false);

  const getNode = (id: AgentNodeId) =>
    nodes.find((n) => n.id === id) || {
      id,
      name: id,
      role: '',
      status: 'idle' as const,
    };

  const ideate = getNode('ideate');
  const critique = getNode('critique');
  const qualityGate = getNode('quality_gate');
  const compliance = getNode('compliance');
  const rank = getNode('rank');
  const humanSelect = getNode('human_select');
  const writeScript = getNode('write_script');
  const mediaPlan = getNode('media_plan');
  const packageNode = getNode('package');

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ECE9F8] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-lavender-100 flex items-center justify-center text-[#6D4AFF]">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-ink">LangGraph State Machine (Python 3.12)</h3>
              {isSampleReplay ? (
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  Recorded Live Run Replay
                </span>
              ) : (
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Real Agent Stream (SSE)
                </span>
              )}
            </div>
            <p className="text-[11px] text-body">
              Stateful execution graph with MemorySaver checkpointing, conditional quality gate, and parallel Send fan-out.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowArchitecture(!showArchitecture)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#6D4AFF] bg-lavender-50 hover:bg-lavender-100 border border-[#DDD8F5] transition-all self-start sm:self-auto"
        >
          <FileCode2 className="w-3.5 h-3.5" />
          <span>How this agent works</span>
          {showArchitecture ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Main Interactive Visual Graph */}
      <div className="bg-[#FAF9FF] border border-[#ECE9F8] rounded-2xl p-4 sm:p-6 overflow-x-auto">
        <div className="min-w-[840px] space-y-6">

          {/* ROW 1: Ideate -> Critique <-> Quality Gate & Self-Revision Loop */}
          <div className="flex items-center justify-between gap-4 relative">
            {/* 1. Ideate Node */}
            <NodeCard
              name="1. Ideate & Strategist"
              role="Barrier Diagnosis + 15 Spoken Hooks"
              node={ideate}
              isActive={activeNode === 'ideate'}
              badge="Generative"
            />

            {/* Connector */}
            <div className="flex-1 h-0.5 bg-gradient-to-r from-[#6D4AFF]/30 to-[#6D4AFF]/60 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-mono text-[#6D4AFF] font-bold">
                hooks[]
              </span>
            </div>

            {/* 2. Critique Node */}
            <NodeCard
              name="2. Creative Critic"
              role="5-Pillar Rubric Scoring (.30/.25/.20/.15/.10)"
              node={critique}
              isActive={activeNode === 'critique'}
              badge="Evaluation"
            />

            {/* Connector */}
            <div className="flex-1 h-0.5 bg-[#6D4AFF]/60" />

            {/* 3. Conditional Quality Gate */}
            <div
              className={clsx(
                'w-64 p-3.5 rounded-xl border transition-all relative',
                qualityGate.status === 'working' || activeNode === 'quality_gate'
                  ? 'bg-purple-50 border-[#6D4AFF] ring-2 ring-[#6D4AFF]/30'
                  : 'bg-white border-[#ECE9F8]'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Conditional Gate
                </span>
                {revisionCount > 0 && (
                  <span className="text-[10px] font-mono font-bold text-[#6D4AFF] bg-lavender-100 px-1.5 py-0.5 rounded">
                    Loop {revisionCount}/1
                  </span>
                )}
              </div>
              <div className="text-xs font-black text-ink">Score Threshold &gt;= 7.0</div>
              <div className="text-[10px] text-body mt-0.5">
                If mean score &lt; 7.0, routes to Self-Revision. Otherwise routes to Compliance.
              </div>
            </div>
          </div>

          {/* Self-Revision Loop Bridge (Visible when revision active or as permanent loop schematic) */}
          <div className="flex items-center justify-end pr-8 -mt-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lavender-100/90 border border-[#DDD8F5] text-[10px] font-mono font-bold text-[#6D4AFF]">
              <RotateCcw className={clsx('w-3 h-3', revisionCount > 0 && 'animate-spin')} />
              <span>
                {revisionCount > 0
                  ? `Self-Revision Triggered (${revisionCount} iteration performed)`
                  : 'Self-Revision Loop: 1 max cycle with targeted prompt injection'}
              </span>
            </div>
          </div>

          {/* ROW 2: Compliance (Tools) -> Rank -> Human-in-the-Loop Interrupt */}
          <div className="flex items-center justify-between gap-4">
            {/* 4. Compliance Guard */}
            <NodeCard
              name="3. Compliance Guard"
              role="Deterministic Tool Safety Audit"
              node={compliance}
              isActive={activeNode === 'compliance'}
              tools={['brand_facts', 'claim_checker']}
              badge="Deterministic Tools"
            />

            {/* Connector */}
            <div className="flex-1 h-0.5 bg-[#6D4AFF]/60" />

            {/* 5. Rank Node */}
            <NodeCard
              name="4. Algorithmic Ranker"
              role="Composite Multi-Dimensional Sorter"
              node={rank}
              isActive={activeNode === 'rank'}
              badge="Pure Formula"
            />

            {/* Connector */}
            <div className="flex-1 h-0.5 bg-[#6D4AFF]/60" />

            {/* 6. Human-in-the-Loop Interrupt */}
            <div
              className={clsx(
                'w-64 p-3.5 rounded-xl border transition-all relative',
                activeNode === 'human_select' || humanSelect.status === 'working'
                  ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300'
                  : humanSelect.status === 'done'
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : 'bg-white border-[#ECE9F8]'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  LangGraph Interrupt
                </span>
                {humanSelect.status === 'done' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
              <div className="text-xs font-black text-ink">5. Human Hook Select</div>
              <div className="text-[10px] text-body mt-0.5">
                Halts state machine in memory. User selects top hooks to fan out.
              </div>
            </div>
          </div>

          {/* ROW 3: Parallel Fan-Out (2 Script Directors) -> Media Plan -> Package */}
          <div className="flex items-center justify-between gap-4">
            {/* 7. Parallel Script Fan-Out */}
            <div
              className={clsx(
                'w-64 p-3.5 rounded-xl border transition-all relative',
                activeNode === 'write_script'
                  ? 'bg-purple-50 border-[#6D4AFF] ring-2 ring-[#6D4AFF]/30'
                  : writeScript.status === 'done'
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : 'bg-white border-[#ECE9F8]'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6D4AFF] bg-lavender-100 px-2 py-0.5 rounded border border-[#DDD8F5] flex items-center gap-1">
                  <GitFork className="w-3 h-3" />
                  Send API Fan-Out
                </span>
                <span className="text-[9px] font-mono font-bold text-ink bg-white px-1.5 py-0.5 rounded border">
                  concurrency=2
                </span>
              </div>
              <div className="text-xs font-black text-ink">6. Script Directors (x2)</div>
              <div className="text-[10px] text-body mt-0.5">
                Spawns 2 parallel sub-nodes to write 15s timed beat scripts simultaneously.
              </div>
              {writeScript.status === 'working' && (
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#6D4AFF] font-bold">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Generating scripts in parallel...
                </div>
              )}
            </div>

            {/* Connector */}
            <div className="flex-1 h-0.5 bg-[#6D4AFF]/60" />

            {/* 8. Media Plan Node */}
            <NodeCard
              name="7. Media Plan & Veo Prompts"
              role="9:16 Vertical Storyboard + Diffusion Prompts"
              node={mediaPlan}
              isActive={activeNode === 'media_plan'}
              badge="Diffusion Planning"
            />

            {/* Connector */}
            <div className="flex-1 h-0.5 bg-[#6D4AFF]/60" />

            {/* 9. Package Node */}
            <NodeCard
              name="8. Package & Ship"
              role="Multi-Modal Payload Assembly"
              node={packageNode}
              isActive={activeNode === 'package'}
              badge={isFinished ? 'Ready to Ship' : 'Final Sink'}
            />
          </div>
        </div>
      </div>

      {/* Expandable Architecture Diagram & Explanation */}
      {showArchitecture && (
        <div className="bg-white border border-[#ECE9F8] rounded-2xl p-5 space-y-4 shadow-sm animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#ECE9F8] pb-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-ink flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#6D4AFF]" />
              LangGraph State Machine Architecture Specification
            </h4>
            <span className="text-[10px] font-mono text-body">Render Single Worker • Python 3.12</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-body leading-relaxed">
            <div className="p-3 bg-lavender-50/50 rounded-xl border border-[#ECE9F8]">
              <div className="font-bold text-ink mb-1 flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-[#6D4AFF]" />
                Self-Revision Quality Gate
              </div>
              <p className="text-[11px]">
                The agent critiques its own generated hooks. If composite score falls below 7.0/10, the router redirects to <code>revise</code> with specific rubric critique injection for up to 1 self-correction cycle.
              </p>
            </div>

            <div className="p-3 bg-lavender-50/50 rounded-xl border border-[#ECE9F8]">
              <div className="font-bold text-ink mb-1 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                Human-in-the-Loop Interrupt
              </div>
              <p className="text-[11px]">
                Using LangGraph&apos;s native <code>interrupt()</code>, the graph halts state execution in memory. It presents the top ranked hooks to the human marketer before committing to script production.
              </p>
            </div>

            <div className="p-3 bg-lavender-50/50 rounded-xl border border-[#ECE9F8]">
              <div className="font-bold text-ink mb-1 flex items-center gap-1.5">
                <GitFork className="w-3.5 h-3.5 text-[#6D4AFF]" />
                Parallel Send Fan-Out
              </div>
              <p className="text-[11px]">
                Selected hooks are dispatched via LangGraph&apos;s <code>Send</code> API to run script directors simultaneously with <code>max_concurrency=2</code>, halving turnaround while preserving strict rate limits.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface NodeCardProps {
  name: string;
  role: string;
  node: NodeState;
  isActive: boolean;
  tools?: string[];
  badge?: string;
}

const NodeCard: React.FC<NodeCardProps> = ({
  name,
  role,
  node,
  isActive,
  tools,
  badge,
}) => {
  const isDone = node.status === 'done';
  const isWorking = node.status === 'working' || isActive;

  return (
    <div
      className={clsx(
        'w-64 p-3.5 rounded-xl border transition-all relative select-none',
        isWorking
          ? 'bg-purple-50/80 border-[#6D4AFF] ring-2 ring-[#6D4AFF]/30 shadow-sm'
          : isDone
          ? 'bg-emerald-50/40 border-emerald-200 shadow-2xs'
          : 'bg-white border-[#ECE9F8]'
      )}
    >
      <div className="flex items-center justify-between mb-1">
        {badge && (
          <span
            className={clsx(
              'text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border',
              isWorking
                ? 'bg-purple-100 text-[#6D4AFF] border-purple-200'
                : isDone
                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                : 'bg-gray-100 text-gray-600 border-gray-200'
            )}
          >
            {badge}
          </span>
        )}
        {isWorking && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-[#6D4AFF]">
            <Loader2 className="w-3 h-3 animate-spin" />
            Active
          </span>
        )}
        {isDone && (
          <div className="flex items-center gap-1">
            {node.durationMs && (
              <span className="text-[9px] font-mono text-body">{node.durationMs}ms</span>
            )}
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
        )}
      </div>

      <div className="text-xs font-black text-ink truncate">{name}</div>
      <div className="text-[10px] text-body mt-0.5 line-clamp-2">{role}</div>

      {tools && tools.length > 0 && (
        <div className="mt-2 pt-2 border-t border-[#ECE9F8] flex items-center gap-1.5 flex-wrap">
          {tools.map((t) => (
            <span
              key={t}
              className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1"
            >
              <ShieldCheck className="w-2.5 h-2.5" />
              {t}()
            </span>
          ))}
        </div>
      )}

      {isDone && node.summary && (
        <div className="mt-2 pt-1.5 border-t border-[#ECE9F8] text-[9.5px] text-body line-clamp-1 italic">
          &ldquo;{node.summary}&rdquo;
        </div>
      )}
    </div>
  );
};

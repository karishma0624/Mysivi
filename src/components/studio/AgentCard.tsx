import React from 'react';
import clsx from 'clsx';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  BrainCircuit,
  PenTool,
  Scale,
  ShieldCheck,
  Award,
  Video,
  Eye,
  Terminal,
} from 'lucide-react';
import { AgentStageId, AgentStatus } from '@shared/types';
import { Waveform } from '../ui/Waveform';

interface AgentCardProps {
  id: AgentStageId;
  name: string;
  role: string;
  status: AgentStatus;
  outputPreview?: string;
  timeMs?: number;
  isCurrent?: boolean;
}

const AGENT_ICONS: Record<AgentStageId, React.ReactNode> = {
  strategist: <BrainCircuit className="w-4 h-4" />,
  hookWriter: <PenTool className="w-4 h-4" />,
  critic: <Scale className="w-4 h-4" />,
  complianceGuard: <ShieldCheck className="w-4 h-4" />,
  ranker: <Award className="w-4 h-4" />,
  scriptDirector: <Video className="w-4 h-4" />,
  visualDirector: <Eye className="w-4 h-4" />,
  videoPromptWriter: <Terminal className="w-4 h-4" />,
};

export const AgentCard: React.FC<AgentCardProps> = ({
  id,
  name,
  role,
  status,
  outputPreview,
  timeMs,
  isCurrent = false,
}) => {
  const icon = AGENT_ICONS[id];

  const getStatusBadge = () => {
    switch (status) {
      case 'working':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-purple bg-lavender-100 px-2 py-0.5 rounded-full animate-pulse border border-[#DDD8F5]">
            WORKING
          </span>
        );
      case 'done':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-success bg-[#E6F8EE] px-2 py-0.5 rounded-full border border-[#BBF7D0]">
            <CheckCircle2 className="w-3 h-3" />
            DONE
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            <AlertCircle className="w-3 h-3" />
            FAILED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-body/60 bg-lavender-50 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" />
            IDLE
          </span>
        );
    }
  };

  return (
    <div
      aria-live="polite"
      className={clsx(
        'relative rounded-2xl p-4 transition-all duration-300 border flex flex-col justify-between select-none',
        isCurrent
          ? 'bg-white border-brand-purple shadow-soft ring-2 ring-brand-purple/20 scale-[1.02]'
          : status === 'done'
          ? 'bg-white/90 border-[#ECE9F8] shadow-card'
          : 'bg-lavender-50/70 border-[#ECE9F8]/70 opacity-75'
      )}
    >
      {/* Top row: Icon, Name & Status */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div
              className={clsx(
                'w-7 h-7 rounded-xl flex items-center justify-center transition-colors',
                status === 'done'
                  ? 'bg-pastel-mint text-brand-success'
                  : status === 'working'
                  ? 'bg-pastel-indigo text-brand-blue animate-pulse-subtle'
                  : 'bg-lavender-100 text-body'
              )}
            >
              {icon}
            </div>
            <div>
              <div className="text-xs font-bold text-ink leading-tight flex items-center gap-1">
                {name}
              </div>
              <div className="text-[10px] text-body">{role}</div>
            </div>
          </div>
          <div>{getStatusBadge()}</div>
        </div>

        {/* Live Active Waveform when working */}
        {status === 'working' && (
          <div className="my-2 py-1.5 px-2.5 bg-lavender-50 rounded-xl border border-[#ECE9F8] flex items-center justify-between">
            <span className="text-[10px] font-semibold text-brand-purple">Reasoning & Synthesizing</span>
            <Waveform active barCount={16} height={14} />
          </div>
        )}

        {/* Live Output Preview */}
        {outputPreview && (
          <div className="mt-2 text-[11px] font-mono text-body bg-lavender-50/90 rounded-xl p-2.5 border border-[#ECE9F8] line-clamp-2 leading-relaxed">
            "{outputPreview}"
          </div>
        )}
      </div>

      {/* Footer info: Runtime */}
      <div className="mt-3 pt-2 border-t border-[#ECE9F8]/60 flex items-center justify-between text-[10px] text-body/70">
        <span>Stage 0{id === 'strategist' ? 1 : id === 'hookWriter' ? 2 : id === 'critic' ? 3 : id === 'complianceGuard' ? 4 : id === 'ranker' ? 5 : id === 'scriptDirector' ? 6 : id === 'visualDirector' ? 7 : 8}</span>
        {timeMs !== undefined && status === 'done' && (
          <span className="font-mono text-brand-purple font-semibold">{timeMs}ms</span>
        )}
      </div>
    </div>
  );
};

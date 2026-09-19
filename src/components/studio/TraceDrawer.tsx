import React from 'react';
import clsx from 'clsx';
import {
  Terminal,
  Download,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { TraceItem } from '@/hooks/useAgentStream';

interface TraceDrawerProps {
  traces: TraceItem[];
  llmCallsCount: number;
  threadId: string | null;
  isOpen: boolean;
  onToggle: () => void;
}

export const TraceDrawer: React.FC<TraceDrawerProps> = ({
  traces,
  llmCallsCount,
  threadId,
  isOpen,
  onToggle,
}) => {
  const downloadTraceJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(traces, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `agent_trace_${threadId || 'run'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-white border border-[#ECE9F8] rounded-[22px] shadow-card overflow-hidden">
      {/* Header bar */}
      <div
        onClick={onToggle}
        className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-lavender-50/50 transition-colors select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-lavender-100 flex items-center justify-center text-[#6D4AFF]">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-extrabold text-ink">
                Execution Trace &amp; Agent Observability
              </h4>
              <span className="text-[10px] font-mono font-bold text-[#6D4AFF] bg-lavender-100 px-2 py-0.5 rounded-full border border-[#DDD8F5]">
                LLM calls: {llmCallsCount}
              </span>
              {threadId && (
                <span className="hidden sm:inline-block text-[10px] font-mono text-body bg-gray-100 px-2 py-0.5 rounded-full">
                  thread: {threadId.slice(0, 14)}...
                </span>
              )}
            </div>
            <p className="text-[11px] text-body mt-0.5">
              Live streamed node durations, tool invocations, and memory checkpoints.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {traces.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                downloadTraceJson();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-[#6D4AFF] bg-lavender-100 hover:bg-lavender-200 border border-[#DDD8F5] transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download Trace JSON</span>
            </button>
          )}

          <div className="p-1 rounded-lg text-body hover:text-ink transition-colors">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Expanded Trace Body */}
      {isOpen && (
        <div className="border-t border-[#ECE9F8] p-4 sm:p-5 bg-[#FAF9FF] max-h-[460px] overflow-y-auto space-y-2 font-mono text-xs">
          {traces.length === 0 ? (
            <div className="text-center py-8 text-body text-xs">
              No trace events recorded yet. Launch an agent run or reload a sample run.
            </div>
          ) : (
            traces.map((trace, idx) => {
              const isRevision = trace.eventType === 'revision_loop';
              const isTool = trace.eventType.startsWith('tool_');
              const isInterrupt = trace.eventType === 'interrupt';

              return (
                <div
                  key={trace.id || idx}
                  className={clsx(
                    'p-3 rounded-xl border flex flex-col sm:flex-row sm:items-start justify-between gap-2 transition-all',
                    isRevision
                      ? 'bg-purple-50/80 border-[#6D4AFF]/30'
                      : isTool
                      ? 'bg-emerald-50/60 border-emerald-200'
                      : isInterrupt
                      ? 'bg-amber-50 border-amber-300'
                      : 'bg-white border-[#ECE9F8]'
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-[10px] text-body/70 shrink-0 mt-0.5">
                      {trace.timestamp}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={clsx(
                            'text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded',
                            isRevision
                              ? 'bg-[#6D4AFF] text-white'
                              : isTool
                              ? 'bg-emerald-600 text-white'
                              : isInterrupt
                              ? 'bg-amber-600 text-white'
                              : 'bg-gray-100 text-ink'
                          )}
                        >
                          {trace.node || trace.eventType}
                        </span>

                        <span className="font-bold text-ink text-xs">
                          {trace.summary}
                        </span>
                      </div>

                      {trace.preview && (
                        <div className="text-[11px] text-body mt-1 line-clamp-1 italic">
                          {trace.preview}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto text-[10px] text-body">
                    {trace.durationMs !== undefined && trace.durationMs > 0 && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-body/70" />
                        {trace.durationMs}ms
                      </span>
                    )}

                    {trace.modelCalls !== undefined && (
                      <span className="font-bold text-[#6D4AFF] bg-lavender-100 px-1.5 py-0.5 rounded">
                        {trace.modelCalls} LLM {trace.modelCalls === 1 ? 'call' : 'calls'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

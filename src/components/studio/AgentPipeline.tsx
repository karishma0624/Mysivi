import React from 'react';
import { AgentStageState } from '@shared/types';
import { AgentCard } from './AgentCard';

interface AgentPipelineProps {
  stages: AgentStageState[];
  currentStageId?: string;
}

export const AgentPipeline: React.FC<AgentPipelineProps> = ({
  stages,
  currentStageId,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-body flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-purple" />
          <span>8-Agent Pipeline (Sequential Execution)</span>
        </h3>
        <span className="text-[11px] text-body/80 font-medium">
          Free-tier optimized: 4 batched API calls + 1 in-code scoring engine
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stages.map((stage) => (
          <AgentCard
            key={stage.id}
            id={stage.id}
            name={stage.name}
            role={stage.role}
            status={stage.status}
            outputPreview={stage.outputPreview}
            timeMs={stage.timeMs}
            isCurrent={stage.id === currentStageId}
          />
        ))}
      </div>
    </div>
  );
};

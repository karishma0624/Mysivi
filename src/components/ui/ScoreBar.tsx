import React from 'react';
import clsx from 'clsx';

interface ScoreBarProps {
  label: string;
  score: number; // 0 to 10
  weight?: number; // e.g. 0.30
  max?: number;
  className?: string;
}

export const ScoreBar: React.FC<ScoreBarProps> = ({
  label,
  score,
  weight,
  max = 10,
  className,
}) => {
  const safeScore = score ?? 0;
  const percentage = Math.min(100, Math.max(0, (safeScore / max) * 100));

  const getBarColor = (val: number) => {
    if (val >= 8.8) return 'from-[#12A36B] to-[#10B981]';
    if (val >= 7.5) return 'from-[#2F5BFF] to-[#6D4AFF]';
    if (val >= 6.0) return 'from-[#6D4AFF] to-[#9333EA]';
    return 'from-[#F59E0B] to-[#EF4444]';
  };

  return (
    <div className={clsx('space-y-1', className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-body flex items-center gap-1.5">
          {label}
          {weight !== undefined && (
            <span className="text-[10px] text-body/70">({Math.round(weight * 100)}%)</span>
          )}
        </span>
        <span className="font-bold text-ink">{safeScore.toFixed(1)}</span>
      </div>
      <div className="h-2 w-full bg-[#ECE9F8] rounded-full overflow-hidden">
        <div
          className={clsx(
            'h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out',
            getBarColor(safeScore)
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

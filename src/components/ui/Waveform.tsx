import React from 'react';
import clsx from 'clsx';

interface WaveformProps {
  active?: boolean;
  progress?: number; // 0 to 1
  onSeek?: (ratio: number) => void;
  barCount?: number;
  height?: number;
  className?: string;
  color?: string;
}

export const Waveform: React.FC<WaveformProps> = ({
  active = false,
  progress = 0,
  onSeek,
  barCount = 28,
  height = 28,
  className,
}) => {
  // Deterministic heights for wave profile
  const baseHeights = [
    25, 40, 65, 85, 45, 30, 60, 95, 80, 50, 35, 75, 90, 100, 70, 45, 60, 85, 65, 40, 55, 75, 40,
    30, 50, 70, 45, 25,
  ];

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio);
  };

  return (
    <div
      onClick={handleClick}
      role={onSeek ? 'slider' : undefined}
      aria-label="Audio scrubber"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={onSeek ? 0 : undefined}
      className={clsx(
        'flex items-center gap-[3px] select-none py-1',
        onSeek && 'cursor-pointer group',
        className
      )}
      style={{ height }}
    >
      {Array.from({ length: barCount }).map((_, i) => {
        const heightPct = baseHeights[i % baseHeights.length];
        const isPast = progress > 0 && i / barCount <= progress;

        return (
          <span
            key={i}
            className={clsx(
              'w-[3px] rounded-full transition-all duration-150',
              isPast
                ? 'bg-gradient-to-t from-brand-blue to-brand-purple'
                : 'bg-[#DDD8F5] group-hover:bg-[#C8C2EC]',
              active && 'animate-wave'
            )}
            style={{
              height: `${heightPct}%`,
              animationDelay: active ? `${(i * 0.05) % 0.8}s` : undefined,
            }}
          />
        );
      })}
    </div>
  );
};

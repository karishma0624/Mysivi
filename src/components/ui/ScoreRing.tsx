import React from 'react';
import clsx from 'clsx';

interface ScoreRingProps {
  score: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 72,
  strokeWidth = 6,
  label,
  sublabel,
  className,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={clsx('flex items-center gap-3', className)}>
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#ECE9F8"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#scoreRingGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="scoreRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2F5BFF" />
              <stop offset="100%" stopColor="#7B4DFF" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute font-extrabold text-sm text-ink">{score}</span>
      </div>
      {(label || sublabel) && (
        <div className="flex flex-col">
          {label && <span className="text-xs font-bold text-ink">{label}</span>}
          {sublabel && <span className="text-[11px] text-body">{sublabel}</span>}
        </div>
      )}
    </div>
  );
};

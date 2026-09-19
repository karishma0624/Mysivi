import React from 'react';
import clsx from 'clsx';
import { Info, Sparkles, Sliders, ShieldCheck, Video, Image as ImageIcon } from 'lucide-react';

export type BadgeKind =
  | 'sample_run'
  | 'simulated'
  | 'ai_predicted'
  | 'animated_preview'
  | 'heuristic'
  | 'illustrated_fallback'
  | 'ai_generated'
  | 'compliance_clean'
  | 'compliance_flag';

interface BadgeProps {
  kind: BadgeKind;
  text?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  kind,
  text,
  size = 'sm',
  className,
}) => {
  const configs = {
    sample_run: {
      label: text || 'Sample run',
      icon: <Info className="w-3 h-3" />,
      style: 'bg-[#F0EEFF] text-[#6D4AFF] border-[#DDD8F5]',
    },
    simulated: {
      label: text || 'Simulated',
      icon: <Sliders className="w-3 h-3" />,
      style: 'bg-[#FFF4E0] text-[#D97706] border-[#FDE68A]',
    },
    ai_predicted: {
      label: text || 'AI-predicted, not real campaign data',
      icon: <Sparkles className="w-3 h-3" />,
      style: 'bg-[#FAF9FF] text-[#6D4AFF] border-[#ECE9F8]',
    },
    animated_preview: {
      label: text || 'Animated preview',
      icon: <Video className="w-3 h-3" />,
      style: 'bg-[#0B1020]/80 backdrop-blur-md text-white border-white/20',
    },
    heuristic: {
      label: text || 'Heuristic, not measured',
      icon: <Info className="w-3 h-3" />,
      style: 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]',
    },
    illustrated_fallback: {
      label: text || 'Illustrated fallback',
      icon: <ImageIcon className="w-3 h-3" />,
      style: 'bg-[#F0EEFF] text-[#6D4AFF] border-[#DDD8F5]',
    },
    ai_generated: {
      label: text || 'AI-generated',
      icon: <Sparkles className="w-3 h-3" />,
      style: 'bg-[#E6F8EE] text-[#12A36B] border-[#BBF7D0]',
    },
    compliance_clean: {
      label: text || 'Brand safe',
      icon: <ShieldCheck className="w-3 h-3" />,
      style: 'bg-[#E6F8EE] text-[#12A36B] border-[#BBF7D0]',
    },
    compliance_flag: {
      label: text || 'Compliance rewrite applied',
      icon: <Info className="w-3 h-3" />,
      style: 'bg-[#FFEDEF] text-[#EF4444] border-[#FECDD3]',
    },
  };

  const current = configs[kind];

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider rounded-full border transition-colors select-none',
        size === 'sm' ? 'text-[10px] px-2.5 py-0.5' : 'text-xs px-3 py-1',
        current.style,
        className
      )}
    >
      <span className="shrink-0">{current.icon}</span>
      <span>{current.label}</span>
    </span>
  );
};

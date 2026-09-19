import React from 'react';
import clsx from 'clsx';

interface StickerProps {
  text: string;
  variant?: 'purple' | 'amber' | 'mint' | 'pink' | 'blue';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Sticker: React.FC<StickerProps> = ({
  text,
  variant = 'purple',
  size = 'md',
  className,
}) => {
  const variantStyles = {
    purple: 'bg-brand-purple text-white shadow-[0_4px_12px_rgba(123,77,255,0.35)]',
    amber: 'bg-[#F59E0B] text-white shadow-[0_4px_12px_rgba(245,158,11,0.35)]',
    mint: 'bg-[#10B981] text-white shadow-[0_4px_12px_rgba(16,185,129,0.35)]',
    pink: 'bg-[#EC4899] text-white shadow-[0_4px_12px_rgba(236,72,153,0.35)]',
    blue: 'bg-brand-blue text-white shadow-[0_4px_12px_rgba(47,91,255,0.35)]',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 border-[2px]',
    md: 'text-xs px-3.5 py-1 border-[2.5px]',
    lg: 'text-sm px-4 py-1.5 border-[3px]',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center font-black italic uppercase tracking-wider rounded-full border-white transform -rotate-2 select-none shrink-0 transition-transform hover:rotate-0 hover:scale-105',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {text}
    </span>
  );
};

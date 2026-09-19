import React from 'react';
import clsx from 'clsx';

interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onClick,
  icon,
  disabled = false,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 select-none border',
        selected
          ? 'bg-brand-purple text-white border-brand-purple shadow-sm shadow-brand-purple/30'
          : 'bg-white text-body border-[#ECE9F8] hover:border-[#DDD8F5] hover:text-ink hover:bg-lavender-50',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

import React from 'react';
import clsx from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none select-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-[10px] gap-1.5',
    md: 'text-sm px-5 py-2.5 rounded-[14px] gap-2',
    lg: 'text-base px-6 py-3.5 rounded-[16px] gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-brand-gradient text-white shadow-glow hover:shadow-[0_10px_28px_-4px_rgba(47,91,255,0.45)] hover:brightness-105 border border-white/20',
    secondary:
      'bg-[#F0EEFF] text-[#6D4AFF] hover:bg-[#E6E2FF] border border-[#DDD8F5]',
    pill:
      'bg-[#F0EEFF] text-[#0B1020] hover:bg-[#E6E2FF] rounded-full px-4 py-1.5 text-xs font-semibold border border-[#E0DCF8]',
    ghost:
      'bg-transparent text-body hover:text-ink hover:bg-lavender-200/50',
    outline:
      'bg-white text-ink border border-[#ECE9F8] hover:border-brand-purple/40 hover:bg-lavender-50 shadow-card',
  };

  return (
    <button
      className={clsx(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

import React from 'react';
import clsx from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
  padded?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  interactive = false,
  padded = true,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'bg-white border border-[#ECE9F8] rounded-[20px] shadow-card transition-all duration-200',
        padded && 'p-5 sm:p-6',
        interactive && 'hover:shadow-soft hover:border-[#DDD8F5] cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

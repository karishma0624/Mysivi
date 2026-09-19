import React from 'react';
import clsx from 'clsx';

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface TabsProps<T extends string = string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (id: T) => void;
  className?: string;
}

export function Tabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  className,
}: TabsProps<T>): React.ReactElement {
  return (
    <div
      role="tablist"
      className={clsx(
        'inline-flex items-center gap-1.5 p-1 bg-lavender-100/90 rounded-2xl border border-[#ECE9F8] overflow-x-auto max-w-full',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 whitespace-nowrap select-none',
              isActive
                ? 'bg-white text-ink shadow-card border border-[#ECE9F8]'
                : 'text-body hover:text-ink hover:bg-white/50 border border-transparent'
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={clsx(
                  'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                  isActive ? 'bg-lavender-100 text-brand-purple' : 'bg-white/80 text-body'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

import React from 'react';
import clsx from 'clsx';
import { Video, BookOpen, MessageCircle, Pin } from 'lucide-react';
import { CalendarItem } from '@shared/types';
import { CopyButton } from '../ui/CopyButton';

interface CalendarGridProps {
  calendar: CalendarItem[];
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ calendar }) => {
  const getFormatBadge = (fmt: CalendarItem['format']) => {
    switch (fmt) {
      case 'Reel':
        return {
          icon: <Video className="w-3 h-3 text-brand-blue" />,
          style: 'bg-pastel-indigo text-brand-blue border-brand-blue/20',
        };
      case 'Carousel':
        return {
          icon: <BookOpen className="w-3 h-3 text-brand-purple" />,
          style: 'bg-pastel-pink text-brand-purple border-brand-purple/20',
        };
      case 'Community Post':
        return {
          icon: <MessageCircle className="w-3 h-3 text-amber-600" />,
          style: 'bg-pastel-amber text-amber-700 border-amber-300',
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ECE9F8] pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-ink">
            7-Day Multi-Format Content Distribution
          </h3>
          <p className="text-xs text-body mt-0.5">
            Balanced weekly cadence: Reels (discovery) • Carousels (retention) • Community Posts (algorithm debate).
          </p>
        </div>

        <span className="text-xs font-semibold text-body bg-lavender-100 px-3 py-1.5 rounded-xl border border-[#DDD8F5]">
          Daily Algorithm Seeding
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {calendar.map((item) => {
          const badge = getFormatBadge(item.format);

          return (
            <div
              key={item.day}
              className="bg-white border border-[#ECE9F8] rounded-2xl p-3.5 shadow-card flex flex-col justify-between space-y-3 hover:border-brand-purple/40 transition-all group"
            >
              {/* Day Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-ink">{item.dayName}</span>
                  <span className="text-[10px] font-mono font-bold text-body/80">Day 0{item.day}</span>
                </div>

                {/* Format Pill */}
                <span
                  className={clsx(
                    'inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border',
                    badge.style
                  )}
                >
                  {badge.icon}
                  <span>{item.format}</span>
                </span>

                {/* Pillar */}
                <div className="text-[10px] font-semibold text-body/80 uppercase tracking-wider truncate">
                  {item.pillar}
                </div>

                {/* Hook / Title */}
                <h5 className="text-xs font-extrabold text-ink leading-snug line-clamp-3 group-hover:text-brand-purple transition-colors">
                  "{item.hookOrHeadline}"
                </h5>
              </div>

              {/* Algorithm Pinned Seed Comment */}
              <div className="pt-2 border-t border-[#ECE9F8] space-y-1">
                <div className="flex items-center justify-between text-[9px] font-bold uppercase text-brand-purple">
                  <span className="flex items-center gap-1">
                    <Pin className="w-2.5 h-2.5" /> Pinned Comment #1
                  </span>
                  <CopyButton text={item.firstCommentPrompt} label="Copy" size="sm" />
                </div>
                <p className="text-[10px] text-body italic leading-relaxed line-clamp-3 bg-lavender-50 p-2 rounded-lg">
                  "{item.firstCommentPrompt}"
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

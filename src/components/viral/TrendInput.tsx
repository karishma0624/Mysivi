import React, { useState } from 'react';
import { Sparkles, Flame, Info } from 'lucide-react';
import { SupportedLanguage, Audience } from '@shared/types';
import { LANGUAGE_OPTIONS } from '@shared/languages';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';

interface TrendInputProps {
  onSubmit: (params: {
    trendDescription: string;
    language: SupportedLanguage;
    audience: Audience;
    goal: string;
  }) => void;
  isLoading: boolean;
}

const PRESET_TRENDS = [
  'POV interview scenes with awkward pauses & internal translation',
  'Corporate buzzword translator roast (what managers say vs mean)',
  'Street challenge: Speak English 20 seconds without saying "umm"',
  'Before vs After: First day at college presentation vs last day',
];

export const TrendInput: React.FC<TrendInputProps> = ({ onSubmit, isLoading }) => {
  const [trendDescription, setTrendDescription] = useState(
    'POV interview scenes with awkward pauses and internal translation buffering'
  );
  const [language, setLanguage] = useState<SupportedLanguage>('Hinglish');
  const [audience, setAudience] = useState<Audience>('Job seekers');
  const [goal] = useState('Drive downloads & peer practice calls');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trendDescription.trim().length < 3) return;
    onSubmit({
      trendDescription: trendDescription.trim(),
      language,
      audience,
      goal,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 1-Tap Trends */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-body flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>Trending Content Formats (Select or Customize)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_TRENDS.map((t, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setTrendDescription(t)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white hover:bg-lavender-100 text-ink border border-[#ECE9F8] shadow-sm transition-all"
            >
              {t.split(':')[0].slice(0, 30)}...
            </button>
          ))}
        </div>
      </div>

      {/* Input text */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="trendInputText" className="font-bold text-ink">
            Observed Social Format or Trend Hook
          </label>
          <span className="text-[11px] text-body font-mono">User Supplied</span>
        </div>
        <textarea
          id="trendInputText"
          value={trendDescription}
          onChange={(e) => setTrendDescription(e.target.value)}
          rows={2}
          className="w-full bg-white border border-[#ECE9F8] rounded-2xl p-3.5 text-sm text-ink placeholder:text-body/50 shadow-sm focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all outline-none resize-none leading-relaxed"
          placeholder="e.g. POV interview scenes with awkward pauses..."
          required
          disabled={isLoading}
        />
      </div>

      {/* Mandatory Honesty Note */}
      <div className="p-3 bg-[#FAF9FF] rounded-xl border border-[#ECE9F8] flex items-center gap-2 text-xs text-body">
        <Info className="w-4 h-4 text-brand-purple shrink-0" />
        <span>
          <strong>Transparency Notice:</strong> Trend input is supplied by user — no live trend scraping intelligence claimed.
        </span>
      </div>

      {/* Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-body">
            Target Audience
          </label>
          <div className="flex flex-wrap gap-1.5">
            {(['Job seekers', 'Students', 'Working professionals', 'Homemakers'] as Audience[]).map(
              (aud) => (
                <Chip
                  key={aud}
                  label={aud}
                  selected={audience === aud}
                  onClick={() => setAudience(aud)}
                  disabled={isLoading}
                />
              )
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-body">
            Language / Script
          </label>
          <div className="flex flex-wrap gap-1.5">
            {LANGUAGE_OPTIONS.map((lang) => (
              <Chip
                key={lang}
                label={lang}
                selected={language === lang}
                onClick={() => setLanguage(lang)}
                disabled={isLoading}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2 flex justify-end">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isLoading || trendDescription.trim().length < 3}
          icon={<Sparkles className="w-4 h-4" />}
        >
          {isLoading ? 'Synthesizing Viral Plan...' : 'Generate Viral Playbook'}
        </Button>
      </div>
    </form>
  );
};

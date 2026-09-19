import React, { useState } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { PainPointInput, Audience, SupportedLanguage, Platform, Tone } from '@shared/types';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { LANGUAGE_OPTIONS } from '@shared/languages';

interface PainPointFormProps {
  initialValues: PainPointInput;
  onSubmit: (input: PainPointInput) => void;
  isLoading: boolean;
}

const PRESET_PAIN_POINTS = [
  {
    label: 'Interview Freeze',
    text: 'I know English, but I freeze when someone asks me a question in an interview.',
    audience: 'Job seekers' as Audience,
    language: 'Hinglish' as SupportedLanguage,
  },
  {
    label: 'Office Standup',
    text: 'During morning client meetings, my mind translates to Hindi and I end up saying nothing.',
    audience: 'Working professionals' as Audience,
    language: 'Hinglish' as SupportedLanguage,
  },
  {
    label: 'College Presentation',
    text: 'I can write project reports in English, but my voice shakes when speaking on stage.',
    audience: 'Students' as Audience,
    language: 'English' as SupportedLanguage,
  },
  {
    label: 'Parent-Teacher Meet',
    text: 'I hesitate to speak English with my children’s school teachers because of my accent.',
    audience: 'Homemakers' as Audience,
    language: 'Hindi' as SupportedLanguage,
  },
];

const AUDIENCES: Audience[] = [
  'Job seekers',
  'Students',
  'Working professionals',
  'Homemakers',
];

const PLATFORMS: Platform[] = [
  'Instagram Reel',
  'YouTube Short',
  'Meta ad',
];

const TONES: Tone[] = ['Relatable', 'Funny', 'Emotional', 'Bold'];

export const PainPointForm: React.FC<PainPointFormProps> = ({
  initialValues,
  onSubmit,
  isLoading,
}) => {
  const [painPoint, setPainPoint] = useState(initialValues.painPoint);
  const [audience, setAudience] = useState<Audience>(initialValues.audience);
  const [language, setLanguage] = useState<SupportedLanguage>(initialValues.language);
  const [platform, setPlatform] = useState<Platform>(initialValues.platform);
  const [tone, setTone] = useState<Tone>(initialValues.tone);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (painPoint.trim().length < 5) return;
    onSubmit({
      painPoint: painPoint.trim(),
      audience,
      language,
      platform,
      tone,
    });
  };

  const handleSelectPreset = (preset: typeof PRESET_PAIN_POINTS[0]) => {
    setPainPoint(preset.text);
    setAudience(preset.audience);
    setLanguage(preset.language);
  };

  const charCount = painPoint.length;
  const maxChars = 200;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1-Tap Example Pain Points */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-body flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
          <span>Quick 1-Tap Learner Scenarios</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_PAIN_POINTS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white hover:bg-lavender-100 text-ink border border-[#ECE9F8] hover:border-brand-purple/40 shadow-sm transition-all"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Text Area with live counter */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="painPointInput" className="font-bold text-ink">
            Learner Pain Point (Voice of Customer)
          </label>
          <span
            className={`font-mono text-xs font-semibold ${
              charCount > maxChars ? 'text-red-500' : 'text-body'
            }`}
          >
            {charCount}/{maxChars}
          </span>
        </div>
        <div className="relative">
          <textarea
            id="painPointInput"
            value={painPoint}
            onChange={(e) => setPainPoint(e.target.value.slice(0, maxChars))}
            rows={3}
            className="w-full bg-white border border-[#ECE9F8] rounded-2xl p-4 text-sm text-ink placeholder:text-body/50 shadow-sm focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all outline-none resize-none leading-relaxed"
            placeholder="e.g. I know English, but I freeze when someone asks me a question in an interview..."
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Selector Chips Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
        {/* Audience */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-body">
            Target Audience
          </label>
          <div className="flex flex-wrap gap-1.5">
            {AUDIENCES.map((aud) => (
              <Chip
                key={aud}
                label={aud}
                selected={audience === aud}
                onClick={() => setAudience(aud)}
                disabled={isLoading}
              />
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-body">
            Practice Language
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

        {/* Platform */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-body">
            Target Platform
          </label>
          <div className="flex flex-wrap gap-1.5">
            {PLATFORMS.map((plat) => (
              <Chip
                key={plat}
                label={plat}
                selected={platform === plat}
                onClick={() => setPlatform(plat)}
                disabled={isLoading}
              />
            ))}
          </div>
        </div>

        {/* Tone */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-body">
            Creative Tone
          </label>
          <div className="flex flex-wrap gap-1.5">
            {TONES.map((t) => (
              <Chip
                key={t}
                label={t}
                selected={tone === t}
                onClick={() => setTone(t)}
                disabled={isLoading}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Submit Action */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#ECE9F8]">
        <div className="text-xs text-body flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-success" />
          <span>Ready to execute 8 sequential autonomous AI agents</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            type="submit"
            size="lg"
            variant="primary"
            disabled={isLoading || painPoint.trim().length < 5}
            icon={isLoading ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            {isLoading ? 'Agents Working...' : 'Run the Agents'}
          </Button>
        </div>
      </div>
    </form>
  );
};

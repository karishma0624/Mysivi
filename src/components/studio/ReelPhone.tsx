import React from 'react';
import clsx from 'clsx';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Mic,
  Sparkles,
  Info,
  RotateCcw,
} from 'lucide-react';
import { ScriptItem, StoryboardFrame } from '@shared/types';
import { SupportedLanguage } from '@shared/languages';
import { useReelPlayer } from '@/hooks/useReelPlayer';
import { SceneComposer } from './SceneComposer';
import { Badge } from '../ui/Badge';
import { Waveform } from '../ui/Waveform';
import { Sticker } from '../ui/Sticker';

interface ReelPhoneProps {
  script: ScriptItem;
  storyboardFrames: StoryboardFrame[];
  language: SupportedLanguage;
  autoPlay?: boolean;
}

export const ReelPhone: React.FC<ReelPhoneProps> = ({
  script,
  storyboardFrames,
  language,
  autoPlay = false,
}) => {
  const {
    isPlaying,
    currentTime,
    progress,
    currentBeatIndex,
    currentBeat,
    currentFrame,
    isMuted,
    ttsStatusMessage,
    togglePlay,
    seek,
    toggleVoiceover,
  } = useReelPlayer({
    script,
    storyboardFrames,
    language,
    autoPlay,
  });

  const formattedTime = `00:${Math.floor(currentTime).toString().padStart(2, '0')}`;
  const totalDuration = `00:${(script?.durationSeconds || 15).toString().padStart(2, '0')}`;
  const hasAiImage = Boolean(currentFrame?.imageUrl && currentFrame?.label === 'AI-generated');

  return (
    <div className="flex flex-col items-center select-none w-full max-w-full">
      {/* Top Mobile Device Frame */}
      <div className="relative w-[300px] sm:w-[340px] aspect-[9/18.5] bg-[#0E1322] rounded-[48px] p-3.5 shadow-[0_25px_60px_-15px_rgba(11,16,32,0.35),0_0_0_1px_rgba(255,255,255,0.15)] ring-1 ring-[#2A3353] flex flex-col justify-between overflow-hidden">
        {/* Outer Phone Bezel Highlights */}
        <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-30" />

        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-4 inset-x-0 flex justify-center z-40 pointer-events-none">
          <div className="w-24 h-5 bg-black rounded-full flex items-center justify-between px-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1F2937] border border-[#374151]" />
            <div className="w-2.5 h-2.5 rounded-full bg-brand-purple/50 animate-pulse" />
          </div>
        </div>

        {/* Screen Canvas */}
        <div className="relative w-full h-full bg-[#0B1020] rounded-[38px] overflow-hidden flex flex-col justify-between z-10">
          {/* Animated Dynamic Background Scene matching the exact active beat */}
          <div className="absolute inset-0 w-full h-full">
            <SceneComposer
              scene={currentFrame?.scene || currentBeat?.scene}
              beatIndex={currentBeatIndex}
              beat={currentBeat}
              frame={currentFrame}
              scenarioHint={script?.hookText || ''}
              isPlaying={isPlaying}
              showLabel={false}
              isAiGenerated={hasAiImage}
              imageUrl={currentFrame?.imageUrl}
            />
          </div>

          {/* Top In-App Status & Progress Bars */}
          <div className="relative z-20 pt-10 px-3.5 space-y-2">
            {/* 4 Segmented Beat Progress Bars */}
            <div className="grid grid-cols-4 gap-1.5">
              {[0, 1, 2, 3].map((bIdx) => {
                let fillPercent = 0;
                if (currentBeatIndex > bIdx) fillPercent = 100;
                else if (currentBeatIndex === bIdx) {
                  const startTimes = [0, 2, 6, 12];
                  const durations = [2, 4, 6, 3];
                  const elapsedInBeat = currentTime - startTimes[bIdx];
                  fillPercent = Math.min(100, Math.max(0, (elapsedInBeat / durations[bIdx]) * 100));
                }

                return (
                  <div
                    key={bIdx}
                    className="h-1 bg-white/25 rounded-full overflow-hidden backdrop-blur-sm"
                  >
                    <div
                      className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
                      style={{ width: `${fillPercent}%` }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Top Bar Badges - Collision Free Flex */}
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="w-4 h-4 rounded-md bg-brand-gradient flex items-center justify-center shadow-sm">
                  <svg viewBox="0 0 24 24" fill="none" className="w-2.5 h-2.5 text-white" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </div>
                <span className="text-[10px] font-black tracking-tight text-white truncate max-w-[85px]">
                  MySivi Reel
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Badge
                  kind={hasAiImage ? 'ai_generated' : 'illustrated_scene'}
                  size="sm"
                />
              </div>
            </div>

            {/* Hook Beat Sticker */}
            <div className="pt-0.5 flex items-center justify-between">
              <Sticker
                text={currentBeat?.name || 'Hook'}
                variant={currentBeatIndex === 2 ? 'mint' : currentBeatIndex === 0 ? 'purple' : 'amber'}
                size="sm"
              />
              <span className="text-[9px] font-mono font-bold text-white/80 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm border border-white/10">
                {currentBeat?.timecode || '0-2s'}
              </span>
            </div>
          </div>

          {/* Center Chat Interaction Overlay */}
          <div className="relative z-20 px-3.5 space-y-2">
            {/* Arya Avatar Greeting Bubble during Beat 3 */}
            {currentBeatIndex === 2 && (
              <div className="animate-in fade-in zoom-in-95 duration-300 bg-brand-gradient p-3 rounded-2xl text-white shadow-glow border border-white/20 space-y-1">
                <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-white/90">
                  <span>Arya • AI Teacher</span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Speaking with you
                  </span>
                </div>
                <p className="text-xs font-semibold leading-snug">
                  "Take a breath! Practice with me — zero judgment here."
                </p>
              </div>
            )}
          </div>

          {/* Bottom Captions & Media Controls */}
          <div className="relative z-20 p-3.5 space-y-2.5 bg-gradient-to-t from-black/95 via-black/80 to-transparent">
            {/* Word-by-Word Subtitle Display */}
            <div className="min-h-[40px] flex items-center justify-center text-center px-1">
              <span className="text-xs sm:text-sm font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] bg-black/50 px-3 py-1.5 rounded-xl border border-white/10 leading-snug">
                {currentBeat?.caption || script?.hookText}
              </span>
            </div>

            {/* Signature Mic & Waveform Indicator */}
            <div className="flex items-center justify-between gap-2.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-2xl border border-white/15">
              <div className="w-6 h-6 rounded-full bg-brand-purple flex items-center justify-center text-white shrink-0 shadow-sm">
                <Mic className="w-3 h-3" />
              </div>
              <div className="flex-1 overflow-hidden">
                <Waveform
                  active={isPlaying}
                  progress={progress}
                  onSeek={seek}
                  barCount={18}
                  height={16}
                />
              </div>
              <span className="text-[9px] font-mono text-white/90 font-bold shrink-0">
                {formattedTime} / {totalDuration}
              </span>
            </div>

            {/* Playback Controls & Voiceover Toggle */}
            <div className="flex items-center justify-between pt-0.5">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  className="w-7 h-7 rounded-full bg-white text-ink flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 fill-ink" /> : <Play className="w-3.5 h-3.5 fill-ink ml-0.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => seek(0)}
                  aria-label="Restart"
                  className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-all"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                </button>
              </div>

              {/* Web Speech API Voiceover Toggle */}
              <button
                type="button"
                onClick={toggleVoiceover}
                className={clsx(
                  'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider transition-all border',
                  !isMuted
                    ? 'bg-brand-purple text-white border-brand-purple shadow-sm'
                    : 'bg-white/15 text-white/80 border-white/20 hover:bg-white/25'
                )}
              >
                {!isMuted ? <Volume2 className="w-2.5 h-2.5" /> : <VolumeX className="w-2.5 h-2.5" />}
                <span className="truncate max-w-[80px]">Voiceover</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Under-Phone Status Note */}
      <div className="mt-3 text-center space-y-1 w-full max-w-[340px] px-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-body">
          <Sparkles className="w-3.5 h-3.5 text-brand-purple shrink-0" />
          <span className="truncate">Tap waveform or play to preview 15s pacing</span>
        </div>
        {ttsStatusMessage && (
          <div className="text-[11px] text-amber-600 font-medium flex items-center justify-center gap-1 break-words max-w-full">
            <Info className="w-3 h-3 shrink-0" />
            <span className="truncate">{ttsStatusMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};


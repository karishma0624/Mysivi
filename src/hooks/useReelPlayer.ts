import { useState, useEffect, useRef, useCallback } from 'react';
import { ScriptItem, StoryboardFrame } from '@shared/types';
import { SupportedLanguage } from '@shared/languages';
import { ttsService } from '@/lib/tts';

interface UseReelPlayerProps {
  script: ScriptItem;
  storyboardFrames: StoryboardFrame[];
  language: SupportedLanguage;
  autoPlay?: boolean;
}

export function useReelPlayer({
  script,
  storyboardFrames,
  language,
  autoPlay = false,
}: UseReelPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // 0 to 15 seconds
  const [isMuted, setIsMuted] = useState(true); // Voiceover toggle
  const [ttsStatusMessage, setTtsStatusMessage] = useState<string | undefined>();
  const totalDuration = script?.durationSeconds || 15;

  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Time boundaries for beats:
  // Beat 0: 0 to 2s
  // Beat 1: 2 to 6s
  // Beat 2: 6 to 12s
  // Beat 3: 12 to 15s
  const getBeatIndexForTime = (time: number): number => {
    if (time < 2) return 0;
    if (time < 6) return 1;
    if (time < 12) return 2;
    return 3;
  };

  const currentBeatIndex = getBeatIndexForTime(currentTime);
  const currentBeat = script?.beats[currentBeatIndex] || script?.beats[0];
  const currentFrame = storyboardFrames[currentBeatIndex] || storyboardFrames[0];

  // Play / Pause controls
  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const seek = useCallback((ratio: number) => {
    const newTime = Math.max(0, Math.min(totalDuration, ratio * totalDuration));
    setCurrentTime(newTime);
  }, [totalDuration]);

  // Handle SpeechSynthesis Voiceover when unmuted
  useEffect(() => {
    if (isPlaying && !isMuted && currentBeat) {
      ttsService.speak(
        currentBeat.voiceover,
        language,
        undefined,
        (err: unknown) => {
          const errObj = err as Error;
          setTtsStatusMessage(errObj?.message || 'Voiceover not available on device');
        }
      );
    } else {
      ttsService.stop();
    }
  }, [isPlaying, isMuted, currentBeatIndex, language]);

  // Main animation loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      lastTimestampRef.current = null;
      return;
    }

    const step = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }
      const deltaSeconds = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      setCurrentTime((prev) => {
        const next = prev + deltaSeconds;
        if (next >= totalDuration) {
          // Loop back to start smoothly
          return 0;
        }
        return next;
      });

      animationFrameRef.current = requestAnimationFrame(step);
    };

    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, totalDuration]);

  // Autoplay if requested
  useEffect(() => {
    if (autoPlay) {
      setIsPlaying(true);
    }
  }, [autoPlay]);

  return {
    isPlaying,
    currentTime,
    progress: currentTime / totalDuration,
    currentBeatIndex,
    currentBeat,
    currentFrame,
    isMuted,
    ttsStatusMessage,
    togglePlay,
    setIsPlaying,
    seek,
    toggleVoiceover: () => setIsMuted((m) => !m),
  };
}

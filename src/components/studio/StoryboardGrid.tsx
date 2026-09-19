import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { StoryboardFrame, StoryboardGenerateOutput } from '@shared/types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { SceneSvg } from '@/data/samples/scenes';
import { api } from '@/lib/api';
import { safeStorage } from '@/lib/storage';

interface StoryboardGridProps {
  frames: StoryboardFrame[];
}

export const StoryboardGrid: React.FC<StoryboardGridProps> = ({ frames }) => {
  const [frameStates, setFrameStates] = useState<Record<number, StoryboardGenerateOutput>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Load from sessionStorage on mount
  useEffect(() => {
    const cached = safeStorage.get<Record<number, StoryboardGenerateOutput>>('storyboard_frames_cache', {});
    setFrameStates(cached);
  }, []);

  const handleGenerateStoryboard = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    const updatedStates = { ...frameStates };
    let quotaHit = false;

    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i];
      setGenerationProgress(i + 1);

      if (quotaHit) {
        // Fallback directly
        updatedStates[frame.frameIndex] = {
          frameIndex: frame.frameIndex,
          imageUrl: null,
          isGenerated: false,
          label: 'Illustrated fallback',
          description: `Custom SVG scene art for frame ${frame.frameIndex}`,
        };
        continue;
      }

      try {
        const res = await api.generateStoryboardFrame({
          frameIndex: frame.frameIndex,
          imagePrompt: frame.imagePrompt,
          fallbackSvgId: frame.fallbackSvgId,
        });

        if (res.data.isGenerated && res.data.imageUrl) {
          updatedStates[frame.frameIndex] = res.data;
        } else {
          // If not generated, quota or fallback
          if (res.data.label === 'Illustrated fallback') {
            quotaHit = true;
          }
          updatedStates[frame.frameIndex] = res.data;
        }
      } catch {
        quotaHit = true;
        updatedStates[frame.frameIndex] = {
          frameIndex: frame.frameIndex,
          imageUrl: null,
          isGenerated: false,
          label: 'Illustrated fallback',
          description: `Custom SVG scene art for frame ${frame.frameIndex}`,
        };
      }
    }

    setFrameStates(updatedStates);
    safeStorage.set('storyboard_frames_cache', updatedStates);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Generate Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ECE9F8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold text-ink">
              Vertical Storyboard Grid (9:16 Frames)
            </h3>
            <span className="text-[10px] font-bold text-body/80 bg-lavender-100 px-2 py-0.5 rounded-full">
              4 Beats
            </span>
          </div>
          <p className="text-xs text-body mt-0.5">
            Photorealistic visual frames designed by Visual Director with verified vector SVG scene fallbacks.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          disabled={isGenerating}
          onClick={handleGenerateStoryboard}
          icon={isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
        >
          {isGenerating ? `Generating (${generationProgress}/4)...` : 'Generate Live Storyboard'}
        </Button>
      </div>

      {/* 4 Vertical Frames Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {frames.map((frame) => {
          const generatedState = frameStates[frame.frameIndex];
          const hasGeneratedImage = Boolean(generatedState?.imageUrl && generatedState?.isGenerated);
          const badgeKind = hasGeneratedImage ? 'ai_generated' : 'illustrated_fallback';

          return (
            <div
              key={frame.frameIndex}
              className="bg-white border border-[#ECE9F8] rounded-[22px] overflow-hidden shadow-card flex flex-col group"
            >
              {/* 9:16 Vertical Canvas */}
              <div className="relative aspect-[9/16] bg-ink overflow-hidden flex items-center justify-center">
                {hasGeneratedImage && generatedState?.imageUrl ? (
                  <img
                    src={generatedState.imageUrl}
                    alt={frame.altText}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full relative">
                    <SceneSvg id={frame.fallbackSvgId} className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Top Badge Overlay */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <span className="font-mono text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/20">
                    {frame.timecode}
                  </span>
                  <Badge kind={badgeKind} size="sm" />
                </div>

                {/* Bottom Frame Index */}
                <div className="absolute bottom-3 left-3 z-10">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                    Frame 0{frame.frameIndex}
                  </span>
                </div>
              </div>

              {/* Frame Info */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h5 className="text-xs font-bold text-ink line-clamp-2">
                    {frame.sceneDescription}
                  </h5>
                </div>
                <div className="pt-2 border-t border-[#ECE9F8] text-[10px] font-mono text-body/80 line-clamp-2">
                  Prompt: {frame.imagePrompt}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

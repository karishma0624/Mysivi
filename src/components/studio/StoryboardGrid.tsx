import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Eye, Copy, Check } from 'lucide-react';
import { StoryboardFrame, StoryboardGenerateOutput } from '@shared/types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { SceneComposer } from './SceneComposer';
import { api } from '@/lib/api';
import { safeStorage } from '@/lib/storage';

interface StoryboardGridProps {
  frames: StoryboardFrame[];
}

export const StoryboardGrid: React.FC<StoryboardGridProps> = ({ frames }) => {
  const [frameStates, setFrameStates] = useState<Record<number, StoryboardGenerateOutput>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [inspectingFrame, setInspectingFrame] = useState<StoryboardFrame | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

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
        updatedStates[frame.frameIndex] = {
          frameIndex: frame.frameIndex,
          imageUrl: null,
          isGenerated: false,
          label: 'Illustrated scene',
          description: `Custom SVG scene art for frame ${frame.frameIndex}`,
          scene: frame.scene,
        };
        continue;
      }

      try {
        const res = await api.generateStoryboardFrame({
          frameIndex: frame.frameIndex,
          imagePrompt: frame.imagePrompt,
          fallbackSvgId: frame.fallbackSvgId || 'interview_freeze',
          scene: frame.scene,
        });

        if (res.data.isGenerated && res.data.imageUrl) {
          updatedStates[frame.frameIndex] = res.data;
        } else {
          if (res.data.label === 'Illustrated scene' || res.data.label === 'Illustrated fallback') {
            quotaHit = true;
          }
          updatedStates[frame.frameIndex] = {
            ...res.data,
            label: 'Illustrated scene',
          };
        }
      } catch {
        quotaHit = true;
        updatedStates[frame.frameIndex] = {
          frameIndex: frame.frameIndex,
          imageUrl: null,
          isGenerated: false,
          label: 'Illustrated scene',
          description: `Custom SVG scene art for frame ${frame.frameIndex}`,
          scene: frame.scene,
        };
      }
    }

    setFrameStates(updatedStates);
    safeStorage.set('storyboard_frames_cache', updatedStates);
    setIsGenerating(false);
  };

  const handleCopyPrompt = (prompt: string, idx: number) => {
    navigator.clipboard.writeText(prompt);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
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
            Structured scenes directed by Visual Director with pure vector SVG illustrations. Zero real-person photos.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          disabled={isGenerating}
          onClick={handleGenerateStoryboard}
          icon={isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
        >
          {isGenerating ? `Rendering (${generationProgress}/4)...` : 'Render Storyboard'}
        </Button>
      </div>

      {/* 4 Vertical Frames Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {frames.map((frame) => {
          const generatedState = frameStates[frame.frameIndex];
          const hasGeneratedImage = Boolean(generatedState?.imageUrl && generatedState?.isGenerated);
          const badgeKind = hasGeneratedImage ? 'ai_generated' : 'illustrated_scene';

          return (
            <div
              key={frame.frameIndex}
              className="bg-white border border-[#ECE9F8] rounded-[22px] overflow-hidden shadow-card flex flex-col group transition-all hover:shadow-lg"
            >
              {/* 9:16 Vertical Canvas */}
              <div className="relative aspect-[9/16] bg-ink overflow-hidden flex items-center justify-center">
                <SceneComposer
                  scene={frame.scene}
                  frame={frame}
                  beatIndex={frame.frameIndex - 1}
                  scenarioHint={frame.sceneDescription}
                  showLabel={false}
                  isAiGenerated={hasGeneratedImage}
                  imageUrl={generatedState?.imageUrl}
                />

                {/* Top Badge Overlay */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <span className="font-mono text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/20">
                    {frame.timecode}
                  </span>
                  <Badge kind={badgeKind} size="sm" />
                </div>

                {/* Bottom Frame Index & Inspect Button */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                    Frame 0{frame.frameIndex}
                  </span>

                  <button
                    type="button"
                    onClick={() => setInspectingFrame(frame)}
                    className="text-[10px] font-bold text-white bg-black/60 hover:bg-black/80 backdrop-blur-md px-2 py-1 rounded-full border border-white/20 flex items-center gap-1 transition-all"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Inspect</span>
                  </button>
                </div>
              </div>

              {/* Frame Info */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h5 className="text-xs font-bold text-ink line-clamp-2">
                    {frame.sceneDescription}
                  </h5>
                </div>

                <div className="pt-2 border-t border-[#ECE9F8] flex items-center justify-between gap-2 text-[10px] font-mono text-body/80">
                  <span className="truncate">Prompt: {frame.imagePrompt}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyPrompt(frame.imagePrompt, frame.frameIndex)}
                    className="shrink-0 p-1 hover:text-brand-purple rounded transition-colors"
                    title="Copy image prompt"
                  >
                    {copiedIndex === frame.frameIndex ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspect Modal */}
      {inspectingFrame && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-[#ECE9F8] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#ECE9F8] pb-3">
              <h4 className="text-base font-extrabold text-ink">
                Frame 0{inspectingFrame.frameIndex} • Scene Specifications
              </h4>
              <button
                type="button"
                onClick={() => setInspectingFrame(null)}
                className="text-body hover:text-ink font-bold text-sm px-2 py-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-ink block">Scene Description:</span>
                <p className="text-body mt-0.5">{inspectingFrame.sceneDescription}</p>
              </div>

              {inspectingFrame.scene && (
                <div className="bg-lavender-50 p-3 rounded-2xl space-y-1.5 border border-[#ECE9F8]">
                  <span className="font-bold text-brand-purple block uppercase text-[10px] tracking-wider">
                    Structured Directives
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div><strong className="text-ink">Setting:</strong> {inspectingFrame.scene.setting}</div>
                    <div><strong className="text-ink">Time of Day:</strong> {inspectingFrame.scene.timeOfDay}</div>
                    <div><strong className="text-ink">Mood:</strong> {inspectingFrame.scene.mood}</div>
                    <div><strong className="text-ink">Character:</strong> {inspectingFrame.scene.subject.who}</div>
                    <div><strong className="text-ink">Action:</strong> {inspectingFrame.scene.subject.action}</div>
                    <div><strong className="text-ink">Expression:</strong> {inspectingFrame.scene.subject.expression}</div>
                    <div><strong className="text-ink">Props:</strong> {inspectingFrame.scene.props.join(', ') || 'none'}</div>
                    <div><strong className="text-ink">Palette:</strong> {inspectingFrame.scene.palette}</div>
                  </div>
                </div>
              )}

              <div>
                <span className="font-bold text-ink block">Diffusion Image Prompt:</span>
                <p className="text-body font-mono mt-0.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200 break-words">
                  {inspectingFrame.imagePrompt}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="secondary" onClick={() => setInspectingFrame(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

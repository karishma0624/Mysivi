import React from 'react';
import {
  Download,
  CheckCircle,
} from 'lucide-react';
import {
  RankedHook,
  ScriptItem,
  StoryboardFrame,
  VideoShotPrompt,
} from '@shared/types';
import {
  generateCreativeBriefMarkdown,
  generateVideoPromptsText,
  downloadJsonFile,
} from '@/lib/export';
import { CopyButton } from '../ui/CopyButton';
import { Button } from '../ui/Button';

interface ExportBarProps {
  painPoint: string;
  audience: string;
  language: string;
  topHooks: RankedHook[];
  primaryScript: ScriptItem;
  storyboard: StoryboardFrame[];
  videoPrompts: VideoShotPrompt[];
}

export const ExportBar: React.FC<ExportBarProps> = ({
  painPoint,
  audience,
  language,
  topHooks,
  primaryScript,
  storyboard,
  videoPrompts,
}) => {
  const briefMarkdown = generateCreativeBriefMarkdown({
    painPoint,
    audience,
    language,
    topHooks,
    primaryScript,
    storyboard,
    videoPrompts,
  });

  const videoPromptsText = generateVideoPromptsText(videoPrompts);

  const handleExportJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      generator: 'Growth Lab by S K Karishma for MySivi',
      briefMeta: {
        painPoint,
        audience,
        language,
      },
      topHooks,
      primaryScript,
      storyboard,
      videoPrompts,
    };
    downloadJsonFile(payload, `mysivi-growth-brief-${Date.now()}.json`);
  };

  return (
    <div className="bg-white border-2 border-brand-purple/25 rounded-[24px] p-6 sm:p-8 shadow-soft space-y-6">
      {/* Ready To Ship Title & Checklist */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#ECE9F8] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F8EE] text-brand-success text-xs font-bold border border-[#BBF7D0] mb-2">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Ready to Ship Production Bundle</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-ink">
            Growth Creative Ready for Deployment
          </h3>
          <p className="text-xs text-body mt-1">
            Complete handoff package for performance marketing, video editors, and UGC creators.
          </p>
        </div>

        {/* 5 Delivery Artifact Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {['Content concept', 'Script', 'Storyboard', 'Video prompt', 'CTA'].map((item, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-lavender-50 text-brand-purple border border-[#ECE9F8]"
            >
              <CheckCircle className="w-3 h-3 text-brand-success" />
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>

      {/* 3 Executive Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-body leading-relaxed max-w-md">
          Copy the full creative brief to Notion/Slack, export full structured JSON for marketing automation, or copy generative prompts directly to Veo/Runway.
        </p>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Copy Brief */}
          <CopyButton
            text={briefMarkdown}
            label="Copy Brief (Markdown)"
            copiedLabel="Brief Copied!"
            size="md"
          />

          {/* Copy Video Prompts */}
          <CopyButton
            text={videoPromptsText}
            label="Copy Video Prompts"
            copiedLabel="Prompts Copied!"
            size="md"
          />

          {/* Download JSON */}
          <Button
            variant="primary"
            size="md"
            onClick={handleExportJson}
            icon={<Download className="w-4 h-4" />}
          >
            Export JSON
          </Button>
        </div>
      </div>
    </div>
  );
};

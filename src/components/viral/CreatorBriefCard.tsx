import React from 'react';
import { Users, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { CreatorBrief } from '@shared/types';
import { Card } from '../ui/Card';
import { CopyButton } from '../ui/CopyButton';

interface CreatorBriefCardProps {
  briefs: CreatorBrief[];
}

export const CreatorBriefCard: React.FC<CreatorBriefCardProps> = ({ briefs }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ECE9F8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold text-ink">
              "Become a Creator" Collaboration Briefs
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-purple bg-lavender-100 px-2 py-0.5 rounded-full">
              UGC Playbook
            </span>
          </div>
          <p className="text-xs text-body mt-0.5">
            Mirroring MySivi’s creator program with non-negotiable brand guardrails and deliverable specs.
          </p>
        </div>

        <span className="text-xs font-semibold text-brand-success bg-[#E6F8EE] px-3 py-1.5 rounded-xl border border-[#BBF7D0]">
          2 Dedicated Creator Tracks
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {briefs.map((brief, idx) => (
          <Card key={idx} className="space-y-5 hover:border-brand-purple/30 transition-all">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-[#ECE9F8] pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-purple">
                  Creator Track 0{idx + 1}
                </span>
                <h4 className="text-base font-extrabold text-ink mt-0.5">{brief.title}</h4>
                <div className="text-[11px] text-body mt-1 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-brand-purple" />
                  <span>{brief.creatorPersona}</span>
                </div>
              </div>

              <CopyButton
                text={`Title: ${brief.title}\nPersona: ${brief.creatorPersona}\nDeliverables: ${brief.deliverables}\n\nDOS:\n${brief.dos.map(d => `✓ ${d}`).join('\n')}\n\nDON'TS:\n${brief.donts.map(d => `✗ ${d}`).join('\n')}\n\nBrand Voice: ${brief.brandVoiceNotes}`}
                label="Copy Brief"
                size="sm"
              />
            </div>

            {/* Deliverables */}
            <div className="p-3 bg-lavender-50 rounded-xl border border-[#ECE9F8] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-body">
                Required Deliverables
              </span>
              <p className="text-xs text-ink font-semibold">{brief.deliverables}</p>
            </div>

            {/* Dos & Don'ts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Dos */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-success flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Mandated Dos
                </span>
                <ul className="space-y-1.5">
                  {brief.dos.map((d, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-1.5 text-body text-[11px] leading-relaxed">
                      <span className="text-brand-success font-bold">✓</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Don'ts */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Strict Don'ts
                </span>
                <ul className="space-y-1.5">
                  {brief.donts.map((dont, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-1.5 text-body text-[11px] leading-relaxed">
                      <span className="text-rose-500 font-bold">✗</span>
                      <span>{dont}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Brand Voice Notes */}
            <div className="pt-3 border-t border-[#ECE9F8] space-y-1 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand-purple" /> Arya Brand Ethos
              </span>
              <p className="text-body leading-relaxed text-[11px]">
                {brief.brandVoiceNotes}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

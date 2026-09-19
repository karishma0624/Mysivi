import React from 'react';
import { Github, Linkedin, ExternalLink, Heart } from 'lucide-react';
import { BRAND_FACTS } from '@shared/brandFacts';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-[#ECE9F8] bg-white/70 backdrop-blur-md pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-[#ECE9F8]">
          {/* Col 1: Wordmark & Statement */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-gradient flex items-center justify-center text-white">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
              <span className="font-extrabold text-base text-ink">Growth Lab</span>
            </div>
            <p className="text-xs text-body leading-relaxed max-w-sm">
              An AI growth engineering prototype demonstrating how agent pipelines turn learner insights into high-converting video scripts, paid creative matrices, and viral distribution for MySivi.
            </p>
          </div>

          {/* Col 2: Brand Integrity Note */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink">Brand Integrity & Disclosures</h4>
            <p className="text-xs text-body leading-relaxed">
              {BRAND_FACTS.disclaimer}
            </p>
            <p className="text-[11px] text-body/80">
              Unofficial prototype built by S K Karishma for her application to MySivi. Not affiliated with MySivi. Style inspired by mysivi.ai; site facts as displayed there.
            </p>
          </div>

          {/* Col 3: Candidate Links */}
          <div className="space-y-3 md:text-right">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink">Built by S K Karishma</h4>
            <div className="flex items-center md:justify-end gap-3 pt-1">
              <a
                href="https://github.com/karishma0624"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-lavender-100 hover:bg-lavender-200 text-ink transition-colors border border-[#ECE9F8]"
              >
                <Github className="w-3.5 h-3.5" />
                <span>github.com/karishma0624</span>
                <ExternalLink className="w-3 h-3 text-body" />
              </a>
              <a
                href="https://www.linkedin.com/in/karishma-sivakumar-25a3a4300/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-lavender-100 hover:bg-lavender-200 text-[#2F5BFF] transition-colors border border-[#ECE9F8]"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 text-body" />
              </a>
            </div>
            <p className="text-[11px] text-body/70">
              Target Role: AI Marketing Intern @ MySivi
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-body/70 gap-3">
          <p>© 2026 Growth Lab • Built with React 18, TypeScript, Tailwind CSS & Google GenAI SDK</p>
          <p className="flex items-center gap-1">
            Proof of work made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for MySivi
          </p>
        </div>
      </div>
    </footer>
  );
};

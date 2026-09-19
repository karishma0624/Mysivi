import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import { Home } from '@/pages/Home';
import { Studio } from '@/pages/Studio';
import { AdLab } from '@/pages/AdLab';
import { ViralLab } from '@/pages/ViralLab';
import { PromptLibrary } from '@/pages/PromptLibrary';
import { NotFound } from '@/pages/NotFound';

export const AppRoutes: React.FC = () => {
  return (
    <PageShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/ads" element={<AdLab />} />
        <Route path="/viral" element={<ViralLab />} />
        <Route path="/prompts" element={<PromptLibrary />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageShell>
  );
};

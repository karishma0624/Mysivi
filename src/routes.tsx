import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import { Home } from '@/pages/Home';
import { Studio } from '@/pages/Studio';
import { AdLab } from '@/pages/AdLab';
import { ViralLab } from '@/pages/ViralLab';
import { PromptLibrary } from '@/pages/PromptLibrary';
import { NotFound } from '@/pages/NotFound';

const DevScenes = import.meta.env.DEV ? lazy(() => import('@/pages/DevScenes')) : null;

export const AppRoutes: React.FC = () => {
  return (
    <PageShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/ads" element={<AdLab />} />
        <Route path="/viral" element={<ViralLab />} />
        <Route path="/prompts" element={<PromptLibrary />} />
        {import.meta.env.DEV && DevScenes && (
          <Route
            path="/dev/scenes"
            element={
              <Suspense fallback={<div className="p-8 text-white">Loading scene test bench...</div>}>
                <DevScenes />
              </Suspense>
            }
          />
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageShell>
  );
};

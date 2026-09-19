import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { ReelPhone } from '../src/components/studio/ReelPhone';
import { ScriptItem, StoryboardFrame } from '../shared/types';
import { SAMPLE_SCRIPTS_OUTPUT, SAMPLE_MEDIA_PLAN_OUTPUT } from '../src/data/samples/studio.sample';

describe('ReelPhone Visual Resolution Guard', () => {
  const sampleScript: ScriptItem = SAMPLE_SCRIPTS_OUTPUT.scripts[0];
  const sampleFrames: StoryboardFrame[] = SAMPLE_MEDIA_PLAN_OUTPUT.storyboardFrames;

  it('always resolves a non-empty visual element (SVG illustrated scene) on Beat 1', () => {
    const { container } = render(
      React.createElement(ReelPhone, {
        script: sampleScript,
        storyboardFrames: sampleFrames,
        language: 'Hinglish',
      })
    );

    // Must have SVG rendered (SceneComposer)
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();

    // Must have Illustrated scene badge
    expect(container.textContent).toContain('Illustrated scene');
    // Must NOT be blank
    expect(container.innerHTML).not.toBe('');
  });

  it('prioritizes AI-generated image over SVG when imageUrl and AI-generated label are present', () => {
    const aiFrames: StoryboardFrame[] = [
      {
        ...sampleFrames[0],
        imageUrl: 'https://images.mysivi.ai/generated_frame_1.png',
        label: 'AI-generated',
      },
      ...sampleFrames.slice(1),
    ];

    const { container } = render(
      React.createElement(ReelPhone, {
        script: sampleScript,
        storyboardFrames: aiFrames,
        language: 'English',
      })
    );

    const img = container.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('https://images.mysivi.ai/generated_frame_1.png');
    expect(container.textContent).toContain('AI-generated');
  });

  it('falls back to SceneComposer illustrated scene if imageUrl is null (never blank)', () => {
    const framesWithNullImage: StoryboardFrame[] = sampleFrames.map((f) => ({
      ...f,
      imageUrl: null,
      label: 'Illustrated scene',
    }));

    const { container } = render(
      React.createElement(ReelPhone, {
        script: sampleScript,
        storyboardFrames: framesWithNullImage,
        language: 'Hinglish',
      })
    );

    // Never blank
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(container.textContent).toContain('Illustrated scene');
  });

  it('resolves visual gracefully even if storyboardFrames array is empty', () => {
    const { container } = render(
      React.createElement(ReelPhone, {
        script: sampleScript,
        storyboardFrames: [],
        language: 'Hindi',
      })
    );

    // Fallback inference creates valid SVG scene
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(container.textContent).toContain('Illustrated scene');
  });
});

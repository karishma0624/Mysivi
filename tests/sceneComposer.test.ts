import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { SceneComposer } from '../src/components/studio/SceneComposer';
import { Setting, Mood, SubjectWho } from '../shared/types';

const allSettings: Setting[] = [
  'classroom_pta',
  'office_interview',
  'cafe',
  'conference_room',
  'college_campus',
  'bus_stop',
  'bedroom_study',
  'metro_train',
  'living_room',
  'dinner_table',
  'street_market',
];

const allWho: SubjectWho[] = [
  'young_woman',
  'young_man',
  'mother',
  'father',
  'student_f',
  'student_m',
  'professional_f',
  'professional_m',
  'arya_avatar',
  'none',
];

const allMoods: Mood[] = [
  'anxious',
  'embarrassed',
  'hesitant',
  'hopeful',
  'confident',
  'joyful',
];

describe('SceneComposer Visual Engine', () => {
  it.each(allSettings)('renders setting without crashing: %s', (setting) => {
    const { container } = render(
      React.createElement(SceneComposer, {
        scene: {
          setting,
          timeOfDay: 'morning',
          mood: 'anxious',
          subject: { who: 'young_woman', action: 'freezing', expression: 'worried' },
          props: ['laptop'],
          palette: 'warm_anxious',
          cameraMotion: 'static',
        },
      })
    );
    expect(container.querySelector('svg')).toBeTruthy();
    expect(container.textContent).toContain('Illustrated scene');
  });

  it.each(allWho)('renders character archetype: %s', (who) => {
    const { container } = render(
      React.createElement(SceneComposer, {
        scene: {
          setting: 'classroom_pta',
          timeOfDay: 'afternoon',
          mood: 'hopeful',
          subject: { who, action: 'speaking_confidently', expression: 'smiling' },
          props: ['phone_with_mysivi'],
          palette: 'hopeful_lavender',
          cameraMotion: 'static',
        },
      })
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it.each(allMoods)('renders mood effect overlay: %s', (mood) => {
    const { container } = render(
      React.createElement(SceneComposer, {
        scene: {
          setting: 'office_interview',
          timeOfDay: 'afternoon',
          mood,
          subject: { who: 'young_woman', action: 'speaking_confidently', expression: 'smiling' },
          props: [],
          palette: 'cool_corporate',
          cameraMotion: 'static',
        },
      })
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders AI-generated image when isAiGenerated is true and imageUrl is provided', () => {
    const { container } = render(
      React.createElement(SceneComposer, {
        isAiGenerated: true,
        imageUrl: 'data:image/png;base64,mock',
      })
    );
    expect(container.querySelector('img')).toBeTruthy();
    expect(container.textContent).toContain('AI-generated');
  });
});

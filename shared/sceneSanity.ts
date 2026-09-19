import { Scene, Setting, SubjectWho, Palette, ScriptBeat } from './types';

export interface SceneSanityResult {
  scene: Scene;
  corrected: boolean;
  reason?: string;
  originalSetting?: Setting;
}

export interface SceneKeywordRule {
  setting: Setting;
  defaultWho?: SubjectWho;
  keywords: string[];
}

export const SCENE_RULES: SceneKeywordRule[] = [
  {
    setting: 'classroom_pta',
    defaultWho: 'mother',
    keywords: [
      'pta',
      'parent-teacher',
      'parent teacher',
      'parents meeting',
      'report card',
      'teacher',
      'school',
      'kindergarten',
      'class teacher',
      'child',
      'kids school',
    ],
  },
  {
    setting: 'office_interview',
    defaultWho: 'young_woman',
    keywords: [
      'interview',
      'hr',
      'recruiter',
      'resume',
      'job offer',
      'placement',
      'hiring manager',
      'tell me about yourself',
      'mock interview',
    ],
  },
  {
    setting: 'cafe',
    defaultWho: 'young_man',
    keywords: [
      'cafe',
      'coffee',
      'order',
      'waiter',
      'barista',
      'cappuccino',
      'latte',
      'ordering coffee',
    ],
  },
  {
    setting: 'conference_room',
    defaultWho: 'professional_f',
    keywords: [
      'standup',
      'scrum',
      'meeting',
      'manager',
      'boardroom',
      'client call',
      'team review',
      'sync',
      'office discussion',
    ],
  },
  {
    setting: 'college_campus',
    defaultWho: 'student_f',
    keywords: [
      'presentation',
      'class',
      'college',
      'professor',
      'seminar',
      'campus',
      'lecture',
      'viva',
      'assignment',
    ],
  },
  {
    setting: 'bus_stop',
    defaultWho: 'young_man',
    keywords: [
      'bus',
      'commute',
      'bus stop',
      'transit',
      'waiting for bus',
      'bus conductor',
    ],
  },
  {
    setting: 'metro_train',
    defaultWho: 'young_woman',
    keywords: [
      'metro',
      'train',
      'subway',
      'tube',
      'metro station',
    ],
  },
  {
    setting: 'bedroom_study',
    defaultWho: 'student_m',
    keywords: [
      'mirror',
      'bedroom',
      'late night',
      'studying alone',
      'desk practice',
    ],
  },
  {
    setting: 'dinner_table',
    defaultWho: 'father',
    keywords: [
      'dinner',
      'family dinner',
      'relatives',
      'eating with family',
      'dining table',
    ],
  },
  {
    setting: 'street_market',
    defaultWho: 'mother',
    keywords: [
      'market',
      'shopkeeper',
      'store',
      'bargaining',
      'street vendor',
      'groceries',
    ],
  },
];

/**
 * Normalizes text and matches against keyword rules with word boundaries.
 */
function findMatchingRule(text: string): { rule: SceneKeywordRule; matchedKeyword: string } | null {
  const normalized = ` ${text.toLowerCase().replace(/[^a-z0-9\- ]/g, ' ')} `;

  for (const rule of SCENE_RULES) {
    for (const keyword of rule.keywords) {
      // Check word boundary or clean substring match
      const kw = keyword.toLowerCase();
      const pattern = new RegExp(`(?:^|\\s)${kw.replace('-', '[- ]')}(?:\\s|$)`, 'i');
      if (pattern.test(normalized) || normalized.includes(` ${kw} `)) {
        return { rule, matchedKeyword: keyword };
      }
    }
  }

  return null;
}

/**
 * Checks the chosen scene against keywords in the beat voiceover, visual text and pain point.
 * If the LLM's setting contradicts a strong keyword match, correct it and log "scene corrected".
 * If no keyword matches, keep the LLM's choice.
 */
export function sceneSanity(
  scene: Scene,
  beatText: string,
  painPoint: string
): SceneSanityResult {
  const combinedText = `${beatText || ''} ${painPoint || ''}`;
  const match = findMatchingRule(combinedText);

  if (!match) {
    // No keyword match: keep LLM's choice
    return {
      scene,
      corrected: false,
    };
  }

  const { rule, matchedKeyword } = match;

  if (scene.setting === rule.setting) {
    // Already matching
    return {
      scene,
      corrected: false,
    };
  }

  // Contradiction detected: correct the scene setting
  const correctedScene: Scene = {
    ...scene,
    setting: rule.setting,
    subject: {
      ...scene.subject,
      // If the current character doesn't fit the setting (e.g. student in PTA meeting)
      // and isn't Arya in a turn beat, use the setting's natural archetype
      who:
        scene.subject.who === 'arya_avatar'
          ? 'arya_avatar'
          : rule.defaultWho || scene.subject.who,
    },
  };

  return {
    scene: correctedScene,
    corrected: true,
    originalSetting: scene.setting,
    reason: `scene corrected: from '${scene.setting}' to '${rule.setting}' due to keyword '${matchedKeyword}'`,
  };
}

/**
 * Enforces consistency across beats within a single script:
 * - Keeps the same subject.who across beats unless a turn beat introduces Arya
 * - Keeps harmonious palette
 */
export function enforceScriptConsistency(
  beats: ScriptBeat[],
  overridePalette?: Palette
): ScriptBeat[] {
  if (!beats || beats.length === 0) return beats;

  // 1. Identify primary protagonist
  const firstNonArya = beats.find(
    (b) => b.scene?.subject?.who && b.scene.subject.who !== 'arya_avatar' && b.scene.subject.who !== 'none'
  );
  const primaryWho: SubjectWho = firstNonArya?.scene?.subject?.who || 'young_woman';

  // 2. Identify primary palette
  const primaryPalette: Palette = overridePalette || beats[0]?.scene?.palette || 'warm_anxious';

  return beats.map((beat, idx) => {
    if (!beat.scene) return beat;

    const isTurnBeat = idx === 2 || beat.name.toLowerCase().includes('turn') || beat.name.toLowerCase().includes('arya');
    const who = isTurnBeat && beat.scene.subject.who === 'arya_avatar' ? 'arya_avatar' : primaryWho;

    return {
      ...beat,
      scene: {
        ...beat.scene,
        palette: isTurnBeat ? 'hopeful_lavender' : idx === 3 ? 'bold_success' : primaryPalette,
        subject: {
          ...beat.scene.subject,
          who,
        },
      },
    };
  });
}

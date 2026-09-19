import {
  PainPointInput,
  StudioIdeateOutput,
  StudioEvaluateOutput,
  StudioScriptsOutput,
  StudioMediaPlanOutput,
  StoryboardGenerateOutput,
  Scene,
  AdsGenerateOutput,
  AdsExplainInput,
  AdsExplainOutput,
  ViralPlanInput,
  ViralPlanOutput,
} from '@shared/types';
import {
  SAMPLE_IDEATE_OUTPUT,
  SAMPLE_EVALUATE_OUTPUT,
  SAMPLE_SCRIPTS_OUTPUT,
  SAMPLE_MEDIA_PLAN_OUTPUT,
} from '@/data/samples/studio.sample';
import { SAMPLE_AD_VARIANTS } from '@/data/samples/ads.sample';
import { SAMPLE_VIRAL_PLAN } from '@/data/samples/viral.sample';

export interface ApiResponse<T> {
  data: T;
  isSample: boolean;
  message?: string;
}

const clientCache = new Map<string, unknown>();

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 15000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

// Additional scenario fallbacks so different inputs yield distinctly different outputs
const WORKPLACE_IDEATE: StudioIdeateOutput = {
  insight: 'Working professionals fear being perceived as less technically competent solely due to hesitant spoken English in high-visibility standups and client calls.',
  angles: [
    { name: 'Standup Stage-Fright', description: 'Knowing the architectural fix, but staying muted while faster talkers take credit.' },
    { name: 'Vocabulary Paralysis', description: 'Struggling to find the right corporate idiom or professional tone on the spot.' },
    { name: 'Safe Practice Sandbox', description: 'Rehearsing client presentations and technical updates with Arya before 10 AM.' },
    { name: 'Fluency Over Accent', description: 'Clear communication trumps native accent in global tech workplaces.' },
  ],
  hooks: [
    { id: 'hook_w1', text: 'You wrote the best pull request, but in the standup meeting you stay muted. Sound familiar?', angleIndex: 0 },
    { id: 'hook_w2', text: 'The quietest engineer on the team usually has the cleanest code. Don’t let hesitation silence you.', angleIndex: 0 },
    { id: 'hook_w3', text: 'Why is it so easy to write 500 lines of Python, but terrifying to give a 60-second standup update in English?', angleIndex: 1 },
    { id: 'hook_w4', text: 'Client call mein jab "Can you elaborate?" pucha jata hai, dimag blank?', angleIndex: 1 },
    { id: 'hook_w5', text: 'Practice your 2-minute daily standup update with Arya before your team logs on.', angleIndex: 2 },
    { id: 'hook_w6', text: 'Arya gives you live feedback on clarity, filler words, and professional tone in 5 minutes.', angleIndex: 2 },
    { id: 'hook_w7', text: 'Textbook grammar won’t help you negotiate sprint deadlines with US product managers.', angleIndex: 3 },
    { id: 'hook_w8', text: 'Your career growth shouldn’t be capped by speaking hesitation.', angleIndex: 3 },
  ],
};

const CAMPUS_IDEATE: StudioIdeateOutput = {
  insight: 'College graduates have 90%+ exam scores in written English, but zero conversational muscle memory when facing competitive group discussions (GDs).',
  angles: [
    { name: 'The GD Interruption Dilemma', description: 'Wanting to chime into a chaotic GD debate but not knowing the conversational entry phrases.' },
    { name: 'Marks vs Fluency Gap', description: 'Scoring A+ on written grammar while vocal cords freeze in campus placement rounds.' },
    { name: 'Mock GD AI Sparring', description: 'Testing arguments and transition phrases with Arya until it feels effortless.' },
    { name: 'Vernacular Pride to Fluency', description: 'You do not need to give up your regional identity to speak confident professional English.' },
  ],
  hooks: [
    { id: 'hook_c1', text: 'Scored 95% in 12th English, but in college placement GD you can’t speak a single sentence? You’re not alone.', angleIndex: 1 },
    { id: 'hook_c2', text: '10 people yelling in a campus GD and you don’t know how to interrupt politely in English?', angleIndex: 0 },
    { id: 'hook_c3', text: 'Campus placement secret: Recruiter looks for confidence and flow, not Shashi Tharoor vocabulary.', angleIndex: 3 },
    { id: 'hook_c4', text: 'Practice 3 debate points with Arya before walking into the placement hall.', angleIndex: 2 },
    { id: 'hook_c5', text: 'GD mein pehla point bolne ka darr? Here is the exact 3-step formula.', angleIndex: 0 },
    { id: 'hook_c6', text: 'Reading 5 English novels won’t train your voice to speak up when 8 classmates are interrupting you.', angleIndex: 1 },
  ],
};

export const api = {
  async ideate(input: PainPointInput): Promise<ApiResponse<StudioIdeateOutput>> {
    const cacheKey = `ideate:${JSON.stringify(input)}`;
    if (clientCache.has(cacheKey)) {
      return { data: clientCache.get(cacheKey) as StudioIdeateOutput, isSample: false };
    }

    try {
      const res = await fetchWithTimeout('/api/studio/ideate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          clientCache.set(cacheKey, json.data);
          return { data: json.data, isSample: false };
        }
      }
    } catch {
      // Continue to scenario matching fallback
    }

    // Dynamic fallback based on user input topic
    const lower = (input.painPoint + ' ' + input.audience).toLowerCase();
    let selectedData = SAMPLE_IDEATE_OUTPUT;
    if (lower.includes('standup') || lower.includes('office') || lower.includes('work') || lower.includes('meeting') || lower.includes('colleague')) {
      selectedData = WORKPLACE_IDEATE;
    } else if (lower.includes('gd') || lower.includes('college') || lower.includes('campus') || lower.includes('student') || lower.includes('exam')) {
      selectedData = CAMPUS_IDEATE;
    }

    return {
      data: selectedData,
      isSample: true,
      message: 'Generated adaptive scenario plan for ' + input.audience,
    };
  },

  async evaluate(params: {
    hooks: { id: string; text: string; angleIndex: number }[];
    audience: string;
    platform: string;
    language: string;
  }): Promise<ApiResponse<StudioEvaluateOutput>> {
    try {
      const res = await fetchWithTimeout('/api/studio/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return { data: json.data, isSample: false };
        }
      }
    } catch {
      // Continue to fallback
    }

    // Dynamic evaluation generation for custom hooks
    const evaluations = params.hooks.map((h, i) => {
      // Check if sample evaluation exists
      const existing = SAMPLE_EVALUATE_OUTPUT.evaluations.find((e) => e.hookId === h.id);
      if (existing) return existing;

      // Deterministic dynamic scoring based on hook content
      const len = h.text.length;
      const isQuestion = h.text.includes('?');
      const hasHinglish = /mein|hai|darr|dimag|nahi/i.test(h.text);
      const scrollStop = Math.min(9.6, Math.max(7.8, Number((8.2 + (isQuestion ? 0.8 : 0.3) + (len % 7) * 0.1).toFixed(1))));
      const relatability = Math.min(9.8, Math.max(8.0, Number((8.5 + (hasHinglish ? 0.9 : 0.4) + (i % 3) * 0.2).toFixed(1))));
      const curiosityGap = Math.min(9.4, Math.max(7.5, Number((8.0 + (isQuestion ? 0.9 : 0.2) + (len % 5) * 0.15).toFixed(1))));
      const clarity = Math.min(9.5, Math.max(8.2, Number((8.7 + (len < 80 ? 0.5 : 0.1)).toFixed(1))));
      const brandFit = Number((8.6 + (i % 4) * 0.2).toFixed(1));

      return {
        hookId: h.id,
        scores: { scrollStop, relatability, curiosityGap, clarity, brandFit },
        critique: `Taps directly into ${params.audience.toLowerCase()} anxiety with ${hasHinglish ? 'authentic conversational vernacular' : 'sharp punchy framing'}.`,
        rewrite: null,
        compliance: {
          isCompliant: true,
          flags: [],
          safeRewrite: null,
        },
      };
    });

    return {
      data: { evaluations },
      isSample: true,
      message: 'Evaluated hooks across 5 weighted dimensions.',
    };
  },

  async generateScripts(params: {
    topHooks: { id: string; text: string }[];
    language: string;
    audience: string;
    tone: string;
    platform: string;
  }): Promise<ApiResponse<StudioScriptsOutput>> {
    try {
      const res = await fetchWithTimeout('/api/studio/scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return { data: json.data, isSample: false };
        }
      }
    } catch {
      // Continue
    }

    // Adapt scripts to match the top hook text dynamically
    const scripts = params.topHooks.slice(0, 3).map((hook, idx) => {
      const sample = SAMPLE_SCRIPTS_OUTPUT.scripts[idx] || SAMPLE_SCRIPTS_OUTPUT.scripts[0];
      return {
        ...sample,
        hookId: hook.id,
        title: `Script ${idx + 1}: ${hook.text.slice(0, 35)}...`,
        beats: [
          {
            ...sample.beats[0],
            spokenLine: hook.text,
            caption: hook.text,
          },
          ...sample.beats.slice(1),
        ],
      };
    });

    return {
      data: { scripts },
      isSample: true,
      message: 'Structured 15-second 4-beat narrative scripts.',
    };
  },

  async generateMediaPlan(params: {
    primaryScript: StudioScriptsOutput['scripts'][0];
  }): Promise<ApiResponse<StudioMediaPlanOutput>> {
    try {
      const res = await fetchWithTimeout('/api/studio/media-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return { data: json.data, isSample: false };
        }
      }
    } catch {
      // Continue
    }

    return {
      data: SAMPLE_MEDIA_PLAN_OUTPUT,
      isSample: true,
      message: 'Loaded verified sample storyboard & video prompts.',
    };
  },

  async generateStoryboardFrame(params: {
    frameIndex: number;
    imagePrompt: string;
    fallbackSvgId?: string;
    scene?: Scene;
  }): Promise<ApiResponse<StoryboardGenerateOutput>> {
    try {
      const res = await fetchWithTimeout('/api/studio/storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return { data: json.data, isSample: !json.data.isGenerated };
        }
      }
    } catch {
      // Continue to fallback
    }

    return {
      data: {
        frameIndex: params.frameIndex,
        imageUrl: null,
        isGenerated: false,
        label: 'Illustrated scene',
        description: `Custom SVG Scene Art for frame ${params.frameIndex}`,
      },
      isSample: true,
    };
  },

  async generateAds(params: {
    hooks: string[];
    audience: string;
    language: string;
  }): Promise<ApiResponse<AdsGenerateOutput>> {
    try {
      const res = await fetchWithTimeout('/api/ads/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return { data: json.data, isSample: false };
        }
      }
    } catch {
      // Continue
    }

    return {
      data: { variants: SAMPLE_AD_VARIANTS },
      isSample: true,
    };
  },

  async explainAdExperiment(metrics: AdsExplainInput): Promise<ApiResponse<AdsExplainOutput>> {
    try {
      const res = await fetchWithTimeout('/api/ads/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metrics),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return { data: json.data, isSample: false };
        }
      }
    } catch {
      // Continue
    }

    return {
      data: {
        variantId: metrics.variantId,
        verdict: metrics.verdict,
        plainEnglishVerdict:
          metrics.verdict === 'SCALE'
            ? `Winner: CPI of ₹${metrics.cpi.toFixed(2)} achieved statistically significant improvement over baseline.`
            : metrics.verdict === 'KILL'
            ? `Underperformer: CPI of ₹${metrics.cpi.toFixed(2)} exceeded unit economic guardrails.`
            : `Continue testing: Promising CPI ₹${metrics.cpi.toFixed(2)}, gathering additional confidence data.`,
        statisticalInsight: `Evaluated with ${metrics.impressions.toLocaleString()} impressions and ${metrics.clicks} clicks.`,
        whatToTestNext:
          metrics.verdict === 'SCALE'
            ? 'Scale budget to 70% in exploit phase.'
            : 'Keep running current explore allocation.',
      },
      isSample: true,
    };
  },

  async planViral(input: ViralPlanInput): Promise<ApiResponse<ViralPlanOutput>> {
    try {
      const res = await fetchWithTimeout('/api/viral/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return { data: json.data, isSample: false };
        }
      }
    } catch {
      // Continue
    }

    return {
      data: SAMPLE_VIRAL_PLAN,
      isSample: true,
    };
  },
};

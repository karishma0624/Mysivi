/**
 * Brand Facts for MySivi
 * Strictly holds facts visible on mysivi.ai.
 * "as displayed on mysivi.ai"
 * Do NOT invent numbers or unsupported claims.
 */

export interface MetricFact {
  label: string;
  value: string;
  source: string;
  description: string;
}

export interface FeatureFact {
  name: string;
  tagline: string;
  details: string;
}

export const BRAND_FACTS = {
  appName: 'MySivi',
  sourceUrl: 'https://mysivi.ai',
  disclaimer: 'Facts compiled strictly as displayed on mysivi.ai. No invented statistics.',
  
  metrics: {
    downloads: {
      value: '10M+',
      label: 'Downloads',
      source: 'As displayed on mysivi.ai',
      description: 'Over 10 million learners have downloaded the app.',
    },
    languages: {
      value: '15+',
      label: 'Languages',
      source: 'As displayed on mysivi.ai',
      description: 'Support for practice across 15+ native regional languages.',
    },
    rating: {
      value: '4.7★',
      label: 'User Rating',
      source: 'As displayed on mysivi.ai',
      description: '4.7 user rating as displayed on mysivi.ai.',
    },
    activeLearners: {
      value: '500K+',
      label: 'Active Learners Worldwide',
      source: 'As displayed on mysivi.ai',
      description: 'Half a million active learners practicing spoken English.',
    },
  },

  coreFeatures: [
    {
      name: 'Arya — AI English Teacher',
      tagline: 'Your non-judgmental conversational tutor',
      details: 'Instant spoken feedback on pronunciation, grammar, and fluency without anxiety or fear of being judged.',
    },
    {
      name: 'Co-Learner Practice Calls',
      tagline: 'Connect with fellow learners worldwide',
      details: 'Safe, moderated peer-to-peer practice calls to practice real conversational spontaneity.',
    },
    {
      name: 'Scenario-Based Learning',
      tagline: 'Real-world situations',
      details: 'Tailored practice tracks for job interviews, office meetings, daily conversations, and travel.',
    },
    {
      name: 'Personalized Learning Path',
      tagline: 'Adapts to your fluency level',
      details: 'Custom grammar checkpoints, daily word goals, and adaptive speaking prompts.',
    },
    {
      name: 'Multi-Language Support',
      tagline: 'Learn English from your native tongue',
      details: 'Explanations and context bridged from Hindi, Tamil, Telugu, Kannada, and other regional languages.',
    },
    {
      name: 'Progress & Fluency Tracking',
      tagline: 'Daily speaking streaks and vocabulary growth',
      details: 'Real-time score rings for grammar accuracy, speaking minutes, and vocabulary acquired.',
    },
  ] as FeatureFact[],

  bannedClaims: [
    'Fluent in 30 days',
    'Guaranteed job placement',
    'Guaranteed 100% fluency',
    'Any competitor name-calling or bashing (e.g. Duolingo, Cambly, Elsa Speak)',
    'Shaming learner for broken English or regional accent',
  ],
} as const;

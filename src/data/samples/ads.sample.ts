import { AdVariant } from '@shared/types';
import { CampaignVariantMetrics } from '@/lib/stats';

export const SAMPLE_AD_VARIANTS: AdVariant[] = [
  {
    id: 'var_control',
    variantName: 'Control — Starting Problem',
    hook: 'You don’t have bad English. You have an English-starting problem.',
    angle: 'Mechanical Inertia',
    audience: 'Job seekers & graduates',
    primaryText: 'Freezing in interview rounds? Practice spoken English with Arya in private before facing the real panel.',
    headline: 'Practice Spoken English',
    description: 'Zero judgment AI tutor',
    ctaType: 'Download',
  },
  {
    id: 'var_a',
    variantName: 'Variant A — The 3-Second Panic',
    hook: 'HR asks "Tell me about yourself" and your brain freezes?',
    angle: 'Situational Anxiety',
    audience: 'Fresh graduates facing campus placements',
    primaryText: 'Stop translating Hindi to English mid-sentence. 5-minute daily practice calls with Arya build speaking reflexes.',
    headline: 'Never Freeze in Interviews',
    description: 'Free 5-min practice call',
    ctaType: 'Install Now',
  },
  {
    id: 'var_b',
    variantName: 'Variant B — Safe Zone (Winner)',
    hook: 'Arya doesn’t judge when you pause for words.',
    angle: 'Psychological Safety',
    audience: 'Learners with speaking hesitation',
    primaryText: 'No coaching fees, no mocking peers. Practice real conversational English anytime with Arya on MySivi.',
    headline: 'Speak English Without Fear',
    description: '10M+ confident learners',
    ctaType: 'Try Free Call',
  },
  {
    id: 'var_c',
    variantName: 'Variant C — The Textbook Trap',
    hook: 'Studied English for 12 years. Still afraid to speak?',
    angle: 'Action vs Theory',
    audience: 'Working professionals in client meetings',
    primaryText: 'Reading grammar books won’t fix spoken hesitation. Arya gives you instant voice feedback in real time.',
    headline: 'Turn Reading Into Speaking',
    description: 'Instant feedback with Arya',
    ctaType: 'Download App',
  },
];

export const SAMPLE_CAMPAIGN_METRICS: CampaignVariantMetrics[] = [
  {
    id: 'var_control',
    name: 'Control — Starting Problem',
    isControl: true,
    impressions: 15400,
    clicks: 462,
    installs: 120,
    spend: 4620,
  },
  {
    id: 'var_a',
    name: 'Variant A — The 3-Second Panic',
    impressions: 14200,
    clicks: 540,
    installs: 151,
    spend: 4544,
  },
  {
    id: 'var_b',
    name: 'Variant B — Safe Zone',
    impressions: 16800,
    clicks: 706,
    installs: 226,
    spend: 5424,
  },
  {
    id: 'var_c',
    name: 'Variant C — The Textbook Trap',
    impressions: 8500,
    clicks: 187,
    installs: 34,
    spend: 2400,
  },
];

export interface WeeklyExperiment {
  weekNumber: number;
  dateRange: string;
  hypothesis: string;
  variantTested: string;
  primaryMetric: string;
  metricLift: string;
  statisticalDecision: 'SCALE' | 'KILL' | 'ITERATE';
  learning: string;
}

export const SAMPLE_WEEKLY_EXPERIMENTS: WeeklyExperiment[] = [
  {
    weekNumber: 38,
    dateRange: 'Sep 08 – Sep 14',
    hypothesis:
      'Highlighting psychological safety ("Arya doesn’t judge") will reduce CPI by 25%+ compared to feature-led messaging by disarming learner embarrassment.',
    variantTested: 'Variant B (Safe Zone)',
    primaryMetric: 'Cost Per Install (CPI)',
    metricLift: '₹24.00 vs ₹38.50 control (-37.6% CPI)',
    statisticalDecision: 'SCALE',
    learning:
      'Emotional relief is 3x more potent than grammar claims. Scaled budget from ₹1,000/day to ₹4,000/day as the primary ad set.',
  },
  {
    weekNumber: 37,
    dateRange: 'Sep 01 – Sep 07',
    hypothesis:
      'Targeting final-year engineering students with "campus placement freeze" hooks will achieve higher Click-to-Install conversion than generic job seeker targeting.',
    variantTested: 'Variant A (The 3-Second Panic)',
    primaryMetric: 'Install Conversion Rate',
    metricLift: '28.0% vs 26.0% control (+7.7% CR)',
    statisticalDecision: 'ITERATE',
    learning:
      'CTR was strong (3.80%), but post-click install rate plateaued. Next test: customize play store screenshots to show mock interview tracks.',
  },
  {
    weekNumber: 36,
    dateRange: 'Aug 25 – Aug 31',
    hypothesis:
      'Provocative copy ("Studied English for 12 years. Still afraid?") will generate higher scroll-stop rate and lower cost per click.',
    variantTested: 'Variant C (Textbook Trap)',
    primaryMetric: 'CTR & CPI',
    metricLift: '2.20% CTR, ₹70.59 CPI (+83% over target)',
    statisticalDecision: 'KILL',
    learning:
      'Negative confrontation triggered defensive scrolling and high bounce rates. Confirms brand rule: never shame the learner.',
  },
];

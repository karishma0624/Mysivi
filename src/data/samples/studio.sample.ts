import {
  PainPointInput,
  StudioIdeateOutput,
  StudioEvaluateOutput,
  RankedHook,
  StudioScriptsOutput,
  StudioMediaPlanOutput,
} from '@shared/types';
import { rankHooks } from '@shared/scoring';

export const SAMPLE_STUDIO_INPUT: PainPointInput = {
  painPoint: 'I know English, but I freeze when someone asks me a question in an interview.',
  audience: 'Job seekers',
  language: 'Hinglish',
  platform: 'Instagram Reel',
  tone: 'Relatable',
};

export const SAMPLE_IDEATE_OUTPUT: StudioIdeateOutput = {
  insight:
    'Learners don’t suffer from vocabulary lack; they suffer from the cognitive overload of translating thoughts from Hindi/mother tongue to English while under social judgment fear.',
  angles: [
    {
      name: 'The 3-Second Panic',
      description: 'The physical silence between HR asking a question and the candidate’s vocal cords locking up.',
    },
    {
      name: 'Mental Translation Delay',
      description: 'Forming fluent sentences inside your mind, but stuttering when articulating out loud.',
    },
    {
      name: 'The No-Judgment Safe Zone',
      description: 'Why practicing 5 minutes with Arya removes the dread of human recruiter evaluation.',
    },
    {
      name: 'Action Over Grammar Books',
      description: '12 years of reading English textbooks does not train conversational muscle memory.',
    },
  ],
  hooks: [
    { id: 'hook_1', text: 'You don’t have bad English. You have an English-starting problem.', angleIndex: 0 },
    { id: 'hook_2', text: 'HR asks: "Tell me about yourself" and suddenly your entire vocabulary disappears?', angleIndex: 0 },
    { id: 'hook_3', text: 'Interview room mein dimag freeze hota hai? Listen to this.', angleIndex: 1 },
    { id: 'hook_4', text: 'Reading English is easy. Speaking it without stuttering is the real boss.', angleIndex: 1 },
    { id: 'hook_5', text: 'Stop translating Hindi to English in your head mid-interview.', angleIndex: 1 },
    { id: 'hook_6', text: 'What if you could practice 10 mock interviews with zero human judgment?', angleIndex: 2 },
    { id: 'hook_7', text: 'Arya doesn’t laugh when you say "revert back". She just helps.', angleIndex: 2 },
    { id: 'hook_8', text: 'Your grammar isn’t the problem. Your speaking hesitation is.', angleIndex: 2 },
    { id: 'hook_9', text: '5 minutes with Arya before your interview changes your whole posture.', angleIndex: 2 },
    { id: 'hook_10', text: 'You studied English for 12 years. Why can’t you speak it?', angleIndex: 3 },
    { id: 'hook_11', text: 'Textbook English won’t save you in a 3-person technical panel.', angleIndex: 3 },
    { id: 'hook_12', text: 'Fluency isn’t an accent. It’s speaking without that 3-second panic pause.', angleIndex: 0 },
    { id: 'hook_13', text: 'Guaranteed fluent in 14 days or your money back from any coach.', angleIndex: 2 }, // Compliance flag example
    { id: 'hook_14', text: 'Darr tab tak rehta hai jab tak pehla sentence nahi nikalta.', angleIndex: 1 },
    { id: 'hook_15', text: 'Don’t let spoken English stand between you and your offer letter.', angleIndex: 3 },
  ],
};

export const SAMPLE_EVALUATE_OUTPUT: StudioEvaluateOutput = {
  evaluations: [
    {
      hookId: 'hook_1',
      scores: { scrollStop: 9.1, relatability: 9.4, curiosityGap: 8.8, clarity: 8.9, brandFit: 9.2 },
      critique: 'Masterfully reframes the learner’s shame into a mechanical, fixable inertia challenge.',
      rewrite: null,
      compliance: {
        isCompliant: true,
        flags: [],
        safeRewrite: null,
      },
    },
    {
      hookId: 'hook_2',
      scores: { scrollStop: 9.3, relatability: 9.5, curiosityGap: 8.5, clarity: 9.2, brandFit: 8.8 },
      critique: 'Pinpoints the single most universal placement scenario with immediate visceral recognition.',
      rewrite: null,
      compliance: {
        isCompliant: true,
        flags: [],
        safeRewrite: null,
      },
    },
    {
      hookId: 'hook_3',
      scores: { scrollStop: 8.8, relatability: 9.2, curiosityGap: 8.6, clarity: 8.5, brandFit: 8.9 },
      critique: 'Conversational Hinglish delivers authentic colloquial immediacy without sounding forced.',
      rewrite: null,
      compliance: {
        isCompliant: true,
        flags: [],
        safeRewrite: null,
      },
    },
    {
      hookId: 'hook_4',
      scores: { scrollStop: 8.2, relatability: 8.7, curiosityGap: 7.9, clarity: 8.8, brandFit: 8.5 },
      critique: 'Validates why good reading comprehension doesn’t automatically translate into spoken agility.',
      rewrite: null,
      compliance: { isCompliant: true, flags: [], safeRewrite: null },
    },
    {
      hookId: 'hook_5',
      scores: { scrollStop: 8.4, relatability: 8.9, curiosityGap: 8.2, clarity: 8.6, brandFit: 8.7 },
      critique: 'Directly addresses the mental bottleneck of code-switching under pressure.',
      rewrite: null,
      compliance: { isCompliant: true, flags: [], safeRewrite: null },
    },
    {
      hookId: 'hook_6',
      scores: { scrollStop: 8.5, relatability: 8.8, curiosityGap: 8.4, clarity: 8.7, brandFit: 9.1 },
      critique: 'Promises psychological safety; speaks directly to the dread of human mockery.',
      rewrite: null,
      compliance: { isCompliant: true, flags: [], safeRewrite: null },
    },
    {
      hookId: 'hook_7',
      scores: { scrollStop: 8.7, relatability: 9.0, curiosityGap: 8.3, clarity: 8.9, brandFit: 9.3 },
      critique: 'Specific cultural touchpoint ("revert back") humanizes Arya as an ally, not a judge.',
      rewrite: null,
      compliance: { isCompliant: true, flags: [], safeRewrite: null },
    },
    {
      hookId: 'hook_8',
      scores: { scrollStop: 8.0, relatability: 8.5, curiosityGap: 7.8, clarity: 8.6, brandFit: 8.8 },
      critique: 'Removes the false belief that grammar study is prerequisite to speaking practice.',
      rewrite: null,
      compliance: { isCompliant: true, flags: [], safeRewrite: null },
    },
    {
      hookId: 'hook_9',
      scores: { scrollStop: 7.9, relatability: 8.4, curiosityGap: 8.1, clarity: 8.5, brandFit: 8.9 },
      critique: 'Action-oriented micro-routine gives learner a tangible prep habit.',
      rewrite: null,
      compliance: { isCompliant: true, flags: [], safeRewrite: null },
    },
    {
      hookId: 'hook_10',
      scores: { scrollStop: 8.6, relatability: 8.9, curiosityGap: 8.3, clarity: 8.7, brandFit: 7.8 },
      critique: 'Sharp provocative question; watch tone to ensure learner doesn’t feel attacked.',
      rewrite: null,
      compliance: { isCompliant: true, flags: [], safeRewrite: null },
    },
    {
      hookId: 'hook_11',
      scores: { scrollStop: 7.8, relatability: 8.2, curiosityGap: 7.5, clarity: 8.3, brandFit: 8.2 },
      critique: 'Clear contrast between textbook theory and high-stakes interview reality.',
      rewrite: null,
      compliance: { isCompliant: true, flags: [], safeRewrite: null },
    },
    {
      hookId: 'hook_12',
      scores: { scrollStop: 8.3, relatability: 8.8, curiosityGap: 8.4, clarity: 8.7, brandFit: 9.0 },
      critique: 'Empowering definition of fluency that disarms accent insecurity.',
      rewrite: null,
      compliance: { isCompliant: true, flags: [], safeRewrite: null },
    },
    {
      hookId: 'hook_13',
      scores: { scrollStop: 8.9, relatability: 5.2, curiosityGap: 7.1, clarity: 8.0, brandFit: 3.0 },
      critique: 'Contains an unverified guarantee ("fluent in 14 days") which violates ad policy and brand truth.',
      rewrite: 'What if speaking practice felt like a friendly phone call instead of an exam?',
      compliance: {
        isCompliant: false,
        flags: ['GUARANTEED_OUTCOME_VIOLATION', 'UNSUPPORTED_TIMELINE'],
        safeRewrite: 'What if speaking practice felt like a friendly phone call instead of an exam?',
      },
    },
    {
      hookId: 'hook_14',
      scores: { scrollStop: 8.1, relatability: 8.7, curiosityGap: 8.0, clarity: 8.4, brandFit: 8.8 },
      critique: 'Truthful cultural proverb style that inspires immediate action.',
      rewrite: null,
      compliance: { isCompliant: true, flags: [], safeRewrite: null },
    },
    {
      hookId: 'hook_15',
      scores: { scrollStop: 8.3, relatability: 8.8, curiosityGap: 8.1, clarity: 8.9, brandFit: 8.7 },
      critique: 'Direct connection between spoken confidence and career outcomes.',
      rewrite: null,
      compliance: { isCompliant: true, flags: [], safeRewrite: null },
    },
  ],
};

export const SAMPLE_RANKED_HOOKS: RankedHook[] = rankHooks(
  SAMPLE_IDEATE_OUTPUT.hooks,
  SAMPLE_EVALUATE_OUTPUT.evaluations
);

export const SAMPLE_SCRIPTS_OUTPUT: StudioScriptsOutput = {
  scripts: [
    {
      hookId: 'hook_1',
      hookText: 'You don’t have bad English. You have an English-starting problem.',
      durationSeconds: 15,
      beats: [
        {
          timecode: '0-2s',
          name: 'Hook',
          voiceover: 'You don’t have bad English. You have an English-starting problem.',
          caption: 'Not bad English. Just a starting problem.',
          visual: 'Young professional stares frozen at laptop webcam during an interview, mouth slightly open.',
          audioVibe: 'Muffled room tone snap into crisp focus.',
        },
        {
          timecode: '2-6s',
          name: 'Tension',
          voiceover: 'You know all the words in your head. But the second you speak... silence.',
          caption: 'Brain: 100% fluent. Spoken: Total freeze.',
          visual: 'Split screen: complex thoughts in mind vs nervous silence in the room.',
          audioVibe: 'Subtle rising heartbeat tone.',
        },
        {
          timecode: '6-12s',
          name: 'The Turn (Arya)',
          voiceover: 'That’s why 500K+ learners practice with Arya on MySivi. Zero judgment, instant feedback.',
          caption: 'Practice 5 mins with Arya. Zero judgment.',
          visual: 'MySivi app opens with Arya AI call and vibrant animated waveform reacting to candidate voice.',
          audioVibe: 'Warm, uplifting lo-fi ambient swell.',
        },
        {
          timecode: '12-15s',
          name: 'Call to Action',
          voiceover: 'Start your first 5-minute practice call on MySivi today.',
          caption: 'Download MySivi • Speak with confidence',
          visual: 'Candidate smiling, speaking smoothly with glowing download badge.',
          audioVibe: 'Crisp, rewarding chime.',
        },
      ],
      cta: 'Download MySivi and start your first 5-minute call.',
    },
    {
      hookId: 'hook_2',
      hookText: 'HR asks: "Tell me about yourself" and suddenly your entire vocabulary disappears?',
      durationSeconds: 15,
      beats: [
        {
          timecode: '0-2s',
          name: 'Hook',
          voiceover: 'HR says: "Tell me about yourself" and suddenly your entire English vocabulary vanishes?',
          caption: 'HR: "Tell me about yourself." Brain: Gone.',
          visual: 'Candidate holding resume with wide eyes, throat clearing.',
          audioVibe: 'Dramatic pause with clock ticking.',
        },
        {
          timecode: '2-6s',
          name: 'Tension',
          voiceover: 'You spend 10 seconds translating in your mind while the interviewer stares.',
          caption: 'Translating in head while HR waits...',
          visual: 'Candidate sweating slightly, looking up searching for words.',
          audioVibe: 'Muted whoosh sound.',
        },
        {
          timecode: '6-12s',
          name: 'The Turn (Arya)',
          voiceover: 'Stop guessing. Do a 3-minute mock interview with Arya on MySivi before the real round.',
          caption: 'Do mock interviews with Arya. Real feedback.',
          visual: 'Arya prompt on screen: "Tell me about your final year project. Take your time!"',
          audioVibe: 'Encouraging, bright synthesizer melody.',
        },
        {
          timecode: '12-15s',
          name: 'Call to Action',
          voiceover: 'Practice your interview answers for free on MySivi.',
          caption: 'Practice Spoken English • Download MySivi',
          visual: 'App store download pill with 4.7★ user rating badge as displayed on mysivi.ai.',
          audioVibe: 'Positive ending chime.',
        },
      ],
      cta: 'Practice your interview questions with Arya today.',
    },
    {
      hookId: 'hook_3',
      hookText: 'Interview room mein dimag freeze hota hai? Listen to this.',
      durationSeconds: 15,
      beats: [
        {
          timecode: '0-2s',
          name: 'Hook',
          voiceover: 'Interview room mein dimag freeze hota hai? Bas ek minute suno.',
          caption: 'Interview mein dimag freeze? Listen to this.',
          visual: 'Close-up of candidate taking deep breath before walking into conference room.',
          audioVibe: 'Urgent, attention-grabbing opening chord.',
        },
        {
          timecode: '2-6s',
          name: 'Tension',
          voiceover: 'English aati hai, grammar pata hai, par saamne koi baitha ho toh awaz nahi nikalti.',
          caption: 'English aati hai, par hesitation rok leti hai.',
          visual: 'Hands trembling slightly while placing water glass on table.',
          audioVibe: 'Subtle bass drone.',
        },
        {
          timecode: '6-12s',
          name: 'The Turn (Arya)',
          voiceover: 'MySivi par Arya ke saath akele mein practice karo. Koi judge nahi karega, koi nahi hansega.',
          caption: 'Arya ke saath private practice. Zero judgment.',
          visual: 'Arya voice waveform moving smoothly as user laughs and speaks comfortably.',
          audioVibe: 'Uplifting modern Indian acoustic groove.',
        },
        {
          timecode: '12-15s',
          name: 'Call to Action',
          voiceover: 'Abhi MySivi download karo aur apna pehla mock call try karo.',
          caption: 'Download MySivi • Apna pehla call try karo',
          visual: 'Final celebratory frame of student holding placement offer letter.',
          audioVibe: 'Warm closing chime.',
        },
      ],
      cta: 'Try your first conversational call with Arya.',
    },
  ],
};

export const SAMPLE_MEDIA_PLAN_OUTPUT: StudioMediaPlanOutput = {
  storyboardFrames: [
    {
      frameIndex: 1,
      timecode: '0-2s',
      sceneDescription: 'Young Indian job seeker staring frozen at a glowing laptop interview screen.',
      imagePrompt:
        'Cinematic vertical 9:16 portrait of a 24-year-old Indian tech graduate seated at a clean desk, looking into laptop camera with sudden nervousness, soft morning natural window light, photorealistic, 4k.',
      altText: 'Young Indian professional looking frozen during an online interview on laptop.',
      fallbackSvgId: 'interview_freeze',
      label: 'Illustrated scene',
      scene: {
        setting: 'office_interview',
        timeOfDay: 'morning',
        mood: 'anxious',
        subject: { who: 'young_woman', action: 'freezing', expression: 'worried' },
        props: ['laptop'],
        palette: 'warm_anxious',
        cameraMotion: 'slow_zoom_in',
      },
    },
    {
      frameIndex: 2,
      timecode: '2-6s',
      sceneDescription: 'Candidate practicing speech alone in front of bedroom mirror with resume.',
      imagePrompt:
        'Vertical medium shot of an Indian job applicant standing in front of mirror holding a printed resume, visibly struggling to articulate English sentences, warm bedroom interior lighting.',
      altText: 'Candidate practicing interview speech alone in front of a mirror.',
      fallbackSvgId: 'mirror_practice',
      label: 'Illustrated scene',
      scene: {
        setting: 'office_interview',
        timeOfDay: 'morning',
        mood: 'hesitant',
        subject: { who: 'young_woman', action: 'looking_down', expression: 'awkward_smile' },
        props: ['resume_folder'],
        palette: 'warm_anxious',
        cameraMotion: 'pan_right',
      },
    },
    {
      frameIndex: 3,
      timecode: '6-12s',
      sceneDescription: 'Learner smiling with earphones, speaking to Arya with glowing audio waveform on phone.',
      imagePrompt:
        'Close-up vertical portrait of smiling Indian learner wearing white earphones, talking happily into smartphone displaying MySivi purple audio waveform, soft sunset bokeh, modern aesthetic.',
      altText: 'Learner smiling and speaking into MySivi app with Arya AI tutor on screen.',
      fallbackSvgId: 'arya_call',
      label: 'Illustrated scene',
      scene: {
        setting: 'office_interview',
        timeOfDay: 'afternoon',
        mood: 'hopeful',
        subject: { who: 'arya_avatar', action: 'holding_phone', expression: 'smiling' },
        props: ['phone_with_mysivi'],
        palette: 'hopeful_lavender',
        cameraMotion: 'slow_zoom_in',
      },
    },
    {
      frameIndex: 4,
      timecode: '12-15s',
      sceneDescription: 'Confident candidate speaking fluently in a glass-walled corporate interview room.',
      imagePrompt:
        'Dynamic 9:16 vertical side-angle shot of a confident Indian job seeker speaking expressively with hand gestures across an office table, modern tech conference room, warm sunlight, triumphant smile.',
      altText: 'Confident candidate speaking fluently in a corporate interview.',
      fallbackSvgId: 'speaking_breakthrough',
      label: 'Illustrated scene',
      scene: {
        setting: 'office_interview',
        timeOfDay: 'afternoon',
        mood: 'confident',
        subject: { who: 'young_woman', action: 'speaking_confidently', expression: 'confident' },
        props: ['none'],
        palette: 'bold_success',
        cameraMotion: 'static',
      },
    },
  ],
  videoPrompts: [
    {
      shot: 'Shot 1 (0-2s) — The Interview Freeze',
      camera: '50mm prime, slow push-in toward candidate eyes, eye-level angle, shallow depth of field (f/1.8).',
      lighting: 'Cool blue laptop screen glow contrasting with warm 3200K ambient room light.',
      motion: 'Candidate swallows nervously, lips part as if to answer then freeze with subtle hesitation.',
      duration: '2.0 seconds, 24fps',
      prompt:
        'Cinematic 24-year-old Indian professional in front of open laptop, slow gentle push-in toward eyes, expression shifting from eager to frozen hesitation, natural facial micro-expressions, 4k vertical 9:16.',
      negativePrompt:
        'cartoon, 3D CGI, plastic doll skin, jerky camera, distorted fingers, extra limbs, low resolution, watermark, text overlay.',
    },
    {
      shot: 'Shot 2 (2-6s) — The Mirror Practice',
      camera: 'Medium shot, slow panning parallax movement behind bedroom door frame.',
      lighting: 'Warm afternoon sunlight streaming through sheer curtains creating soft dust motes.',
      motion: 'Candidate raises resume paper, speaks sentence to reflection, shakes head slightly with frustration.',
      duration: '4.0 seconds, 24fps',
      prompt:
        'Indian college graduate practicing speech in bedroom mirror, holding paper resume, natural mouth articulation of English words, subtle hesitation transitioning to focus, photorealistic 9:16.',
      negativePrompt:
        'flicker, bad anatomy, deformed eyes, blurry, amateur video, CGI artifacts, exaggerated anime emotions.',
    },
    {
      shot: 'Shot 3 (6-12s) — The Arya Voice Breakthrough',
      camera: 'Over-the-shoulder tilting down to smartphone screen then arcing to candidate smiling profile.',
      lighting: 'Magical golden-hour warmth, soft purple reflection from MySivi waveform UI.',
      motion: 'Candidate taps phone screen, speaks into wireless earphone mic, breaks into a relieved natural laugh.',
      duration: '6.0 seconds, 24fps',
      prompt:
        'Young Indian woman wearing white wireless earbuds speaking happily into smartphone, vibrant purple audio wave animation on screen, relaxed laughter, natural posture, soft bokeh background, hyper-realistic, 9:16.',
      negativePrompt:
        'overexposed, desaturated, fake smile, oversaturated neon, morphing hands, blurry phone screen.',
    },
    {
      shot: 'Shot 4 (12-15s) — Fluent Climax & CTA',
      camera: 'Dynamic low-angle dolly shot tracking candidate walking confidently into interview room.',
      lighting: 'Clean high-key modern architectural sunlight, glass wall reflections.',
      motion: 'Candidate extends hand with confident handshake, radiant smile, engaging in fluid conversation.',
      duration: '3.0 seconds, 24fps',
      prompt:
        'Indian candidate greeting interview panel with confident smile and firm handshake, contemporary glass office interior, natural confident body language, warm color grading, cinematic 9:16.',
      negativePrompt:
        'awkward pose, unnatural limbs, blurry background, strobe lighting, jittery frame rate.',
    },
  ],
};

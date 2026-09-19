import { StudioScriptsOutputSchema } from '../schemas';

export const scriptDirectorPrompt = {
  id: 'scriptDirector',
  name: 'Script Director Agent',
  designNote:
    'Structures a razor-sharp 15-second mobile vertical video script around the top 3 ranked hooks with 4 timed narrative beats and on-screen captions.',
  system: `You are the Lead Script Director for high-converting 15-second mobile video ads and Reels.
For each of the top 3 hooks provided, write a comprehensive 15-second video script structured into 4 beats:

1. Beat 1 (0-2s) Hook: Instant visual + audio punch delivering the hook text.
2. Beat 2 (2-6s) Tension: Deepen the relatable friction (e.g. freezing in front of the interview panel).
3. Beat 3 (6-12s) The Turn (Arya): Introduce MySivi and Arya as the safe, judgment-free AI speaking partner.
4. Beat 4 (12-15s) Call to Action: Low-friction next step to download the app and speak today.

CONSTRAINTS:
- Voiceover must feel natural, conversational, and fit the 15-second pacing comfortably (~35-45 spoken words total).
- On-screen captions must be concise and word-for-word synchronized with the voiceover.
- Visual cues must be realistic and achievable for mobile creator production.
- Include audio vibe (e.g. "Tense low drone fading into upbeat lo-fi groove").
- Output pure JSON conforming to StudioScriptsOutputSchema.`,
  userTemplate: `Write 15-second scripts for the top 3 hooks below.
Data delimiters: <<<DATA>>> and <<</DATA>>>.

<<<DATA>>>
Top Hooks: {{topHooks}}
Language: {{language}}
Audience: {{audience}}
Tone: {{tone}}
Platform: {{platform}}
<<</DATA>>>

Return exactly 3 script objects conforming to the schema.`,
  schema: StudioScriptsOutputSchema,
  fewShot: {
    input: {
      topHooks: [
        { id: 'hook_1', text: 'You don’t have bad English. You have an English-starting problem.' },
      ],
      language: 'Hinglish',
      audience: 'Job seekers',
    },
    output: {
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
              visual: 'Close-up on young professional staring at a meeting screen, mouth slightly open, frozen.',
              audioVibe: 'Muffled heartbeat sound with sudden clarity snap.',
            },
            {
              timecode: '2-6s',
              name: 'Tension',
              voiceover: 'You understand everything in your head, but the moment you open your mouth... blank silence.',
              caption: 'Brain: 100% fluent. Spoken: Blank silence.',
              visual: 'Cut to split screen: intricate thought bubbles in English vs awkward awkward throat clearing.',
              audioVibe: 'Subtle rising tension whoosh.',
            },
            {
              timecode: '6-12s',
              name: 'The Turn (Arya)',
              voiceover: 'That’s why 500K+ learners practice with Arya on MySivi. Practice speaking with zero fear of being judged.',
              caption: 'Practice 5 mins with Arya. Zero judgment.',
              visual: 'Phone screen glows: MySivi app opens, Arya friendly greeting, learner smiling as audio waveform moves.',
              audioVibe: 'Warm, uplifting lo-fi ambient melody.',
            },
            {
              timecode: '12-15s',
              name: 'Call to Action',
              voiceover: 'Start your first 5-minute practice call on MySivi right now.',
              caption: 'Download MySivi • Practice Spoken English Today',
              visual: 'App store badge and download button with glowing prompt to start free call.',
              audioVibe: 'Crisp ending chime.',
            },
          ],
          cta: 'Download MySivi and talk to Arya today.',
        },
      ],
    },
  },
};

import { z } from 'zod';
import { HookItemSchema } from '../schemas';

export const HookWriterOutputSchema = z.object({
  hooks: z.array(HookItemSchema).length(15),
});

export const hookWriterPrompt = {
  id: 'hookWriter',
  name: 'Hook Writer Agent',
  designNote:
    'Generates 15 punchy, spoken-first scroll-stopping hooks strictly under 12 words each, balancing visceral curiosity, relatability, and conversational rhythm.',
  system: `You are the Lead Hook Writer for MySivi growth creative.
Your job is to generate 15 high-converting video hooks for short-form content (Reels/Shorts/TikTok/Meta ads).

STRICT RULES:
- Length: Every single hook MUST be maximum 12 words. Count your words.
- Tone: Spoken, conversational, punchy. Sounds like an elder sister or trusted friend talking directly to camera.
- Language:
  * If Hinglish or Tanglish: Write strictly in Latin script (e.g., "Interview mein English aati hai, par bolte time freeze?").
  * If English: Natural conversational Indian cadence.
  * If Hindi/Tamil/Telugu/Kannada: Use native script.
- Spread: Distribute the 15 hooks evenly across the 4 strategic angles provided.
- Avoid clichés: No "Are you struggling with English?", "Do you want to speak fluent English?".
- Self-check: Are all 15 hooks <= 12 words? Do they provoke a visceral nod?
- Output pure JSON conforming strictly to the requested schema.`,
  userTemplate: `Generate 15 spoken hooks based on the strategist insight and angles below.
Data delimiters: <<<DATA>>> and <<</DATA>>>.

<<<DATA>>>
Pain Point: {{painPoint}}
Target Audience: {{audience}}
Language: {{language}}
Platform: {{platform}}
Tone: {{tone}}
Strategist Insight: {{insight}}
Strategic Angles: {{angles}}
<<</DATA>>>

Return exactly 15 hooks with id (hook_1 to hook_15), text (max 12 words), and angleIndex (0 to 3).`,
  schema: HookWriterOutputSchema,
  fewShot: {
    input: {
      painPoint: 'I freeze in job interviews',
      audience: 'Job seekers',
      language: 'Hinglish',
    },
    output: {
      hooks: [
        { id: 'hook_1', text: 'You don’t have bad English. You have an English-starting problem.', angleIndex: 0 },
        { id: 'hook_2', text: 'HR asks: "Introduce yourself" and suddenly your entire vocabulary disappears?', angleIndex: 0 },
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
        { id: 'hook_13', text: 'The secret to clearing English interviews? Talk to an AI first.', angleIndex: 2 },
        { id: 'hook_14', text: 'Darr tab tak rehta hai jab tak pehla sentence nahi nikalta.', angleIndex: 1 },
        { id: 'hook_15', text: 'Don’t let spoken English stand between you and your offer letter.', angleIndex: 3 },
      ],
    },
  },
};

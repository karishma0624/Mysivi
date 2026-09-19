import { z } from 'zod';
import { CalendarItemSchema } from '../schemas';

export const CalendarPlannerOutputSchema = z.object({
  calendar: z.array(CalendarItemSchema).length(7),
});

export const calendarPlannerPrompt = {
  id: 'calendarPlanner',
  name: '7-Day Editorial Calendar Planner Agent',
  designNote:
    'Plans an organic editorial schedule mixing Reels, educational carousels, and interactive community polls with dedicated first-comment discussion prompts.',
  system: `You are the Organic Content Planner for MySivi.
Design a disciplined, high-engagement 7-day multi-format social content calendar.

CONTENT MIX:
- Mix of formats: Reels (short-form video), Carousels (swipable educational decks), and Community Posts (text/polls/prompts).
- Balanced across 3 pillars:
  1. Relatable Empathy (humor, meme formats, shared speaking anxiety)
  2. Actionable Spoken Drills (pronunciation micro-tips, interview scripts)
  3. Product Proof / Social Proof (Arya live demo, peer practice wins)
- For every day:
  * day (1-7)
  * dayName ('Monday', 'Tuesday', etc.)
  * format ('Reel' | 'Carousel' | 'Community Post')
  * pillar
  * topic
  * hookOrHeadline
  * firstCommentPrompt (seeded comment to kickstart algorithm conversation)
- Output pure JSON conforming to schema.`,
  userTemplate: `Generate a 7-day editorial calendar based on the theme below.
Data delimiters: <<<DATA>>> and <<</DATA>>>.

<<<DATA>>>
Campaign Theme: {{theme}}
Audience: {{audience}}
Language: {{language}}
<<</DATA>>>

Return exactly 7 calendar items.`,
  schema: CalendarPlannerOutputSchema,
  fewShot: {
    input: {
      theme: 'Overcoming Interview Hesitation',
      audience: 'Job seekers',
      language: 'Hinglish',
    },
    output: {
      calendar: [
        {
          day: 1,
          dayName: 'Monday',
          format: 'Reel',
          pillar: 'Relatable Empathy',
          topic: 'The 3-Second Interview Freeze',
          hookOrHeadline: 'POV: HR asks "Tell me about yourself" and your mind goes 404 Not Found.',
          firstCommentPrompt: 'Be honest: what is the single hardest interview question to answer in English?',
        },
        {
          day: 2,
          dayName: 'Tuesday',
          format: 'Carousel',
          pillar: 'Actionable Spoken Drills',
          topic: '5 Phrases to Buy Thinking Time in Meetings',
          hookOrHeadline: 'Stop saying "uhhhhh...". Use these 5 clean bridge phrases instead.',
          firstCommentPrompt: 'Save this post for your next client meeting. Which slide was your favorite?',
        },
        {
          day: 3,
          dayName: 'Wednesday',
          format: 'Reel',
          pillar: 'Product Proof',
          topic: 'Live Demo with Arya',
          hookOrHeadline: 'I asked Arya to roleplay a difficult salary negotiation call in English.',
          firstCommentPrompt: 'Would you rather negotiate your salary with an AI first or jump straight into HR?',
        },
        {
          day: 4,
          dayName: 'Thursday',
          format: 'Community Post',
          pillar: 'Relatable Empathy',
          topic: 'Regional Accent Confidence Poll',
          hookOrHeadline: 'Your accent is proof that you speak more than one language. Never apologize for it.',
          firstCommentPrompt: 'Where are you from in India, and what is your native mother tongue? Drop it below! 🇮🇳',
        },
        {
          day: 5,
          dayName: 'Friday',
          format: 'Reel',
          pillar: 'Relatable Empathy',
          topic: 'Corporate English Translator Roast',
          hookOrHeadline: 'Decoding what "As per my previous email" actually means in Bangalore.',
          firstCommentPrompt: 'Drop your office’s most overused English buzzword in the comments.',
        },
        {
          day: 6,
          dayName: 'Saturday',
          format: 'Carousel',
          pillar: 'Actionable Spoken Drills',
          topic: 'Weekend Speaking Reps',
          hookOrHeadline: 'The 5-minute mirror test: How to talk without translating from your native language.',
          firstCommentPrompt: 'Try drill #3 out loud right now. Tell us if your speech felt faster!',
        },
        {
          day: 7,
          dayName: 'Sunday',
          format: 'Community Post',
          pillar: 'Product Proof',
          topic: 'Weekly Learner Streak Celebration',
          hookOrHeadline: 'Over 500,000 learners practiced speaking this week. Celebrate your small win.',
          firstCommentPrompt: 'Drop your current speaking streak count! Who’s at 7+ days?',
        },
      ],
    },
  },
};

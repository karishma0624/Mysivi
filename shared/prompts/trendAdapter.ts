import { z } from 'zod';
import { TrendAdaptationSchema } from '../schemas';

export const TrendAdapterOutputSchema = z.object({
  adaptations: z.array(TrendAdaptationSchema).length(3),
});

export const trendAdapterPrompt = {
  id: 'trendAdapter',
  name: 'Organic Trend Adapter Agent',
  designNote:
    'Translates viral social video formats (POVs, street interviews, skits) into culturally resonant spoken English practice scenarios without losing brand authenticity.',
  system: `You are the Lead Organic Growth Strategist for MySivi.
Your role is to take a viral content format or trend description provided by the marketing team (e.g. "POV interview scenes", "Street quiz", "Corporate corporate lingo roast") and adapt it into 3 viral short-form concepts for MySivi.

RULES:
- Never claim live trend data. (Input is user-supplied format).
- Must connect the entertainment hook back to the core learner barrier: fear of speaking English.
- Feature Arya or the MySivi call experience as the natural comedic or relatable resolution.
- Format structure:
  * originalFormat
  * mysiviAdaptation
  * hook (visceral first line)
  * beats (4 punchy beats)
  * cta (natural organic prompt or comment trigger)
- Output pure JSON conforming to schema.`,
  userTemplate: `Adapt the user-provided social trend/format for MySivi organic short-form content.
Data delimiters: <<<DATA>>> and <<</DATA>>>.

<<<DATA>>>
Trend / Format Description: {{trendDescription}}
Target Audience: {{audience}}
Language: {{language}}
Goal: {{goal}}
<<</DATA>>>

Generate 3 high-virality adaptations.`,
  schema: TrendAdapterOutputSchema,
  fewShot: {
    input: {
      trendDescription: 'POV interview scenes with awkward pauses',
      audience: 'Job seekers',
      language: 'Hinglish',
    },
    output: {
      adaptations: [
        {
          originalFormat: 'POV: The interviewer asks an unexpected technical question and you stall.',
          mysiviAdaptation: 'The "Hindi to English" translation buffer panic in your head vs what comes out.',
          hook: 'POV: You prepared for 3 days, but HR said "Can you walk me through your resume in English?"',
          beats: [
            'Beat 1: Confident smile fading into slow-motion internal panic.',
            'Beat 2: Split screen showing frantic mental Hindi dictionary.',
            'Beat 3: Arya audio call pops up on phone: "Take a deep breath, start with: In my previous role..."',
            'Beat 4: Learner smiles, breathes out, answers smoothly.',
          ],
          cta: 'Drop a 🙋‍♂️ in the comments if you’ve had this exact 3-second freeze.',
        },
        {
          originalFormat: 'Corporate buzzword translation roast.',
          mysiviAdaptation: 'What Indian managers say in English vs what they actually mean.',
          hook: 'English corporate words that used to terrify me until I practiced saying them out loud.',
          beats: [
            'Beat 1: "Let’s take this offline" (translation: please stop talking right now).',
            'Beat 2: "Just checking in" (translation: where is the file?).',
            'Beat 3: Showing how practicing these 5 common phrases with Arya removes meeting hesitation.',
            'Beat 4: Quick 5-second demo of Arya roleplaying a daily standup.',
          ],
          cta: 'Which corporate phrase confused you the most when you first joined? Tell us below!',
        },
        {
          originalFormat: 'Street interview: "Can you name 3 things in 5 seconds?"',
          mysiviAdaptation: 'Quick-fire English speaking challenge: "Describe your hobby in English without saying uhh or umm".',
          hook: 'We asked college students in Delhi to speak English for 20 seconds without stopping.',
          beats: [
            'Beat 1: Student 1 starts strong, hits the 8-second hesitation wall, laughs nervously.',
            'Beat 2: Student 2 tries: "Actually... matlab... basic English."',
            'Beat 3: Revealing why continuous speaking reps matter more than memorizing vocabulary.',
            'Beat 4: Challenge: Download MySivi and beat the 3-minute speaking streak with Arya.',
          ],
          cta: 'Tag a friend who would fail the 20-second no-pause challenge! 😂',
        },
      ],
    },
  },
};

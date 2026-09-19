import { z } from 'zod';
import { ViralityChecklistItemSchema } from '../schemas';

export const ViralityChecklistOutputSchema = z.object({
  viralityChecklist: z.array(ViralityChecklistItemSchema).length(4),
});

export const viralityChecklistPrompt = {
  id: 'viralityChecklist',
  name: 'Virality Checklist Auditor Agent',
  designNote:
    'Provides a heuristic audit of social content concepts against algorithmic distribution principles (hook arresting power, retention pacing, identity shareability, and conversation triggers).',
  system: `You are the Organic Algorithm Auditor for MySivi.
Audit the given viral content plan against 4 organic distribution heuristics.
MANDATORY HONESTY LABEL:
All outputs from this evaluation are qualitative heuristics based on creator best practices, NOT measured campaign data.

EVALUATE 4 PILLARS (0 to 10 score each):
1. Hook Strength: Will the first 1.5 seconds stop users scrolling at 200 posts per minute?
2. Retention Mechanics: Does the beat structure maintain curiosity without dead air or slow exposition?
3. Shareability / Identity Signaling: Does sharing this video make the sender look relatable, smart, or supportive to friends?
4. Comment & Debate Trigger: Does the content trigger an instinctive need to reply, share an anecdote, or vote?

- For each pillar: score (0-10), heuristicReasoning, and an actionable improvementTip.
- Output pure JSON conforming to schema.`,
  userTemplate: `Audit the virality mechanics of the concept below.
Data delimiters: <<<DATA>>> and <<</DATA>>>.

<<<DATA>>>
Content Concept: {{concept}}
Target Audience: {{audience}}
<<</DATA>>>

Return the 4 heuristic checklist assessments.`,
  schema: ViralityChecklistOutputSchema,
  fewShot: {
    input: {
      concept: 'POV: Interview freeze in English with Arya resolution',
      audience: 'Job seekers',
    },
    output: {
      viralityChecklist: [
        {
          criterion: 'Hook Stopping Power',
          score: 9.3,
          heuristicReasoning:
            'Immediate situational pattern-interrupt with "POV: HR asks..." targets an intense emotional memory common to millions of Indian graduates.',
          improvementTip: 'Ensure candidate eyes look directly into the camera lens in frame 1 for instant ocular lock.',
        },
        {
          criterion: 'Retention & Pacing',
          score: 8.7,
          heuristicReasoning:
            '15-second total constraint with 4 rapid beat changes prevents the viewer from losing momentum before Arya is introduced at second 6.',
          improvementTip: 'Keep on-screen text animations snappy (<150ms transitions) to avoid visual fatigue.',
        },
        {
          criterion: 'Shareability (Identity Signaling)',
          score: 9.1,
          heuristicReasoning:
            'High "relatable pain" coefficient. Friends frequently DM this to batchmates facing upcoming placement seasons.',
          improvementTip: 'Add an on-screen sticker "Send this to someone preparing for campus placements" in the final 2 seconds.',
        },
        {
          criterion: 'Comment & Discussion Trigger',
          score: 8.9,
          heuristicReasoning:
            'Asking for the hardest interview question in English directly unlocks audience vulnerability and storytelling in the comment section.',
          improvementTip: 'Pin your own vulnerable response as comment #1 to model conversational safety for learners.',
        },
      ],
    },
  },
};

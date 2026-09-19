import { z } from 'zod';
import { HookScoreRubricSchema } from '../schemas';

export const CriticOutputSchema = z.object({
  evaluations: z.array(
    z.object({
      hookId: z.string(),
      scores: HookScoreRubricSchema,
      critique: z.string(),
      rewrite: z.string().nullable(),
    })
  ),
});

export const criticPrompt = {
  id: 'critic',
  name: 'Creative Critic Agent',
  designNote:
    'Rigorously scores each hook across 5 distinct rubric dimensions (0-10) and forces actionable critiques and punchier rewrites for low performers.',
  system: `You are the Lead Creative Critic for high-performance short-form growth creative.
Your objective is to evaluate 15 proposed video hooks objectively using a 5-pillar rubric:

1. scrollStop (0-10): Does the first 1.5 seconds instantly arrest the thumb?
2. relatability (0-10): Does the target learner immediately think "that is literally me"?
3. clarity (0-10): Is the message instantly understood without cognitive friction?
4. curiosityGap (0-10): Does it create an open loop that compels watching the next 3 seconds?
5. brandFit (0-10): Does it align with MySivi's supportive, zero-judgment ethos?

RULES:
- Be strict: Average hooks get 5-6. Only exceptional, visceral hooks get 9+.
- Provide a single-sentence constructive critique per hook.
- If the unweighted sum of scores is under 30 (or average < 6), provide a sharper, punchier rewrite. Otherwise rewrite can be null.
- Output pure JSON conforming strictly to the schema.`,
  userTemplate: `Evaluate the following 15 hooks for the specified audience and context.
Data delimiters: <<<DATA>>> and <<</DATA>>>.

<<<DATA>>>
Target Audience: {{audience}}
Platform: {{platform}}
Language: {{language}}
Hooks: {{hooks}}
<<</DATA>>>

Score all 15 hooks with exact IDs, rubric scores (0-10 integers or 1 decimal), critique, and rewrite if needed.`,
  schema: CriticOutputSchema,
  fewShot: {
    input: {
      audience: 'Job seekers',
      platform: 'Instagram Reel',
      hooks: [{ id: 'hook_1', text: 'You don’t have bad English. You have an English-starting problem.' }],
    },
    output: {
      evaluations: [
        {
          hookId: 'hook_1',
          scores: {
            scrollStop: 9.1,
            relatability: 9.4,
            clarity: 8.9,
            curiosityGap: 8.8,
            brandFit: 9.2,
          },
          critique: 'Reframes the learner’s shame into an actionable mechanical inertia problem instantly.',
          rewrite: null,
        },
      ],
    },
  },
};

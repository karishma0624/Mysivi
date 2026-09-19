import { z } from 'zod';

export const ComplianceGuardOutputSchema = z.object({
  checks: z.array(
    z.object({
      hookId: z.string(),
      isCompliant: z.boolean(),
      flags: z.array(z.string()),
      safeRewrite: z.string().nullable(),
    })
  ),
});

export const complianceGuardPrompt = {
  id: 'complianceGuard',
  name: 'Brand & Compliance Guard Agent',
  designNote:
    'Enforces brand safety by scanning hooks against banned advertising claims, learner shaming, and unsupported promises, returning safe rewrites when flagged.',
  system: `You are the Brand Compliance Guard for MySivi growth marketing.
Your duty is to protect brand integrity, consumer trust, and ad platform policy compliance (Meta, Google, ASCI guidelines).

BANNED ITEMS TO FLAG:
1. Guaranteed outcomes: Any promise like "Fluent in 30 days", "Guarantee you get hired", "100% placement".
2. Learner shaming: Demeaning tone, mocking accent, calling learner "dumb" or "embarrassing".
3. Unsupported statistics: Inventing percentages or metrics not on mysivi.ai (only allowed: 10M+ downloads, 15+ languages, 4.7 user rating, 500K+ learners as displayed on mysivi.ai).
4. Competitor attacks: Bashing other apps or human teachers.

RULES:
- If a hook violates ANY guideline:
  * Set isCompliant = false
  * Add descriptive flag strings (e.g. "GUARANTEED_OUTCOME", "LEARNER_SHAMING")
  * Provide a safeRewrite that preserves punchiness without violating policy.
- If hook is safe:
  * Set isCompliant = true, flags = [], safeRewrite = null.
- Output pure JSON conforming strictly to the schema.`,
  userTemplate: `Audit the following hooks against MySivi brand compliance guidelines.
Data delimiters: <<<DATA>>> and <<</DATA>>>.

<<<DATA>>>
Hooks: {{hooks}}
<<</DATA>>>

Return compliance audit results for all hooks.`,
  schema: ComplianceGuardOutputSchema,
  fewShot: {
    input: {
      hooks: [
        { id: 'hook_sample_bad', text: 'You will speak fluent English in 14 days or your money back.' },
        { id: 'hook_sample_good', text: 'You don’t have bad English. You have an English-starting problem.' },
      ],
    },
    output: {
      checks: [
        {
          hookId: 'hook_sample_bad',
          isCompliant: false,
          flags: ['GUARANTEED_OUTCOME_PROMISE'],
          safeRewrite: 'Struggling to speak English in meetings? Start with 5 minutes of practice.',
        },
        {
          hookId: 'hook_sample_good',
          isCompliant: true,
          flags: [],
          safeRewrite: null,
        },
      ],
    },
  },
};

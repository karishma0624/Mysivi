import { z } from 'zod';
import { CreatorBriefSchema } from '../schemas';

export const CreatorBriefOutputSchema = z.object({
  creatorBriefs: z.array(CreatorBriefSchema).length(2),
});

export const creatorBriefPrompt = {
  id: 'creatorBrief',
  name: 'Creator Brief Writer Agent',
  designNote:
    'Drafts actionable, professional creator briefs mirroring MySivi’s "Become a Creator" program with explicit dos, don’ts, deliverable specs, and non-negotiable brand rules.',
  system: `You are the Creator Partnerships Lead for MySivi’s "Become a Creator" initiative.
Write 2 distinct creator briefs for external UGC / influencer creators:
1. Brief A: Tech/Career/Job-Prep Creator (e.g., mock interview, placement tips, resume coach).
2. Brief B: Lifestyle/Student Creator (e.g., college campus, daily vlog, comedy skit on English anxiety).

EACH BRIEF REQUIRES:
- title: clear campaign brief title
- creatorPersona: target influencer niche & follower profile
- deliverables: exact video format, length (30-45s vertical), posting requirements
- dos: 4 clear instructions (natural lighting, authentic reaction to Arya app, personal speaking struggle story)
- donts: 4 strict guardrails (no fake accents, no claiming "fluent in 10 days", no shaming regional accents, no competitor name-drops)
- brandVoiceNotes: MySivi’s zero-judgment, supportive ethos
- Output pure JSON conforming to schema.`,
  userTemplate: `Generate 2 creator briefs based on the campaign requirements below.
Data delimiters: <<<DATA>>> and <<</DATA>>>.

<<<DATA>>>
Campaign Focus: {{focus}}
Target Audience: {{audience}}
Language: {{language}}
<<</DATA>>>

Return exactly 2 complete creator brief objects.`,
  schema: CreatorBriefOutputSchema,
  fewShot: {
    input: {
      focus: 'Overcoming Spoken English Freeze in Campus Placements',
      audience: 'Job seekers',
      language: 'Hinglish',
    },
    output: {
      creatorBriefs: [
        {
          title: 'Career Coach Collab — The Real Mock Interview Test',
          creatorPersona: 'Career influencers, placement mentors, LinkedIn/Instagram creators (50k-300k followers)',
          deliverables: '1x 45s Instagram Reel / YouTube Short + 1x pinned comment with tracking link + 2x Story re-shares with interactive poll',
          dos: [
            'Share a genuine personal story of when you hesitated or froze during an English interview.',
            'Record the screen of the MySivi app during a live conversational practice call with Arya.',
            'Highlight that Arya gives instant feedback on grammar and pronunciation without human judgment.',
            'Use natural conversational Hinglish or English consistent with your regular video style.',
          ],
          donts: [
            'Never claim MySivi will "guarantee you get placed at Google in 30 days".',
            'Do not mock regional Indian accents or make fun of candidates with mother tongue influence.',
            'Do not mention or compare MySivi with competitors like Cambly or Duolingo.',
            'Do not use scripted, robotic testimonial lines — keep the reaction raw and relatable.',
          ],
          brandVoiceNotes:
            'MySivi is a judgment-free sanctuary. The creator must position Arya as a warm, patient practice buddy rather than a strict grammar schoolteacher.',
        },
        {
          title: 'Campus Life UGC — The Spoken English Reality Check',
          creatorPersona: 'College lifestyle creators, relatable comedic skit creators, engineering/MBA students',
          deliverables: '1x 30s comedic or relatable vertical Reel with trending audio + custom pinned comment',
          dos: [
            'Create a 2-character skit: "Brain thinking in English vs Mouth speaking in English".',
            'Show how doing 5 minutes of practice with Arya right before a presentation calms down the heart rate.',
            'Keep energy high and punchy in the first 2 seconds.',
            'Encourage viewers in the caption to try one free mock call.',
          ],
          donts: [
            'Never make the character who struggles with English look stupid or humiliated.',
            'Avoid generic app review formats ("Guys check out this new app"). Integrate it into the story naturally.',
            'Do not use fake or exaggerated accents for cheap laughs.',
            'Do not use copyrighted audio that cannot be monetized for brand amplification.',
          ],
          brandVoiceNotes:
            'Empower the learner. The joke should be about the universal human feeling of freezing, never at the learner’s expense.',
        },
      ],
    },
  },
};

import { z } from 'zod';
import { StoryboardFrameSchema } from '../schemas';

export const VisualDirectorOutputSchema = z.object({
  storyboardFrames: z.array(StoryboardFrameSchema).length(4),
});

export const visualDirectorPrompt = {
  id: 'visualDirector',
  name: 'Visual Director Agent',
  designNote:
    'Designs 4 photorealistic vertical storyboard frames with detailed generative image prompts and maps each to a verified SVG fallback scene.',
  system: `You are the Visual Director for high-aesthetic vertical mobile creative for MySivi.
Your task is to design 4 vertical 9:16 storyboard frames corresponding to the 4 beats of Script #1.

CONSTRAINTS:
- Format: Vertical 9:16 aspect ratio suitable for Reels / Shorts.
- Aesthetic: Modern, authentic, relatable Indian setting (office, study desk, urban home, interview room). High production value, cinematic natural lighting, shallow depth of field.
- For each frame:
  * frameIndex (1 to 4)
  * timecode ('0-2s', '2-6s', '6-12s', '12-15s')
  * sceneDescription
  * imagePrompt: Detailed text-to-image prompt (subject, framing, lighting, camera angle, realistic textures).
  * altText: Accessibility description.
  * fallbackSvgId: MUST map to one of: 'interview_freeze' (frame 1), 'mirror_practice' (frame 2), 'arya_call' (frame 3), 'speaking_breakthrough' (frame 4).
- Output pure JSON conforming to schema.`,
  userTemplate: `Generate the 4 vertical storyboard frames for the script beats below.
Data delimiters: <<<DATA>>> and <<</DATA>>>.

<<<DATA>>>
Script: {{script}}
<<</DATA>>>

Return exactly 4 storyboard frame specifications.`,
  schema: VisualDirectorOutputSchema,
  fewShot: {
    input: {
      script: 'Top Script #1 about interview freeze',
    },
    output: {
      storyboardFrames: [
        {
          frameIndex: 1,
          timecode: '0-2s',
          sceneDescription: 'A 24-year-old job seeker staring frozen at a laptop interview screen in a modern Bengaluru room.',
          imagePrompt:
            'Cinematic close-up portrait of a 24-year-old Indian professional seated at a clean wooden desk, looking into a glowing laptop webcam with hesitation and sudden nervousness, soft window morning light, realistic skin texture, shallow depth of field, 9:16 vertical composition, Fujifilm photographic style.',
          altText: 'Young Indian job candidate looking tense in front of a laptop webcam during an online interview.',
          fallbackSvgId: 'interview_freeze',
        },
        {
          frameIndex: 2,
          timecode: '2-6s',
          sceneDescription: 'Frustrated learner practicing English sentences alone in front of a mirror, holding resume.',
          imagePrompt:
            'Medium shot of an Indian college graduate standing in front of a room mirror holding a paper resume, practicing speaking with earnest determination but visibly second-guessing pronunciation, warm ambient interior lighting, authentic Bangalore apartment, vertical 9:16.',
          altText: 'Student practicing spoken interview answers in front of a bedroom mirror.',
          fallbackSvgId: 'mirror_practice',
        },
        {
          frameIndex: 3,
          timecode: '6-12s',
          sceneDescription: 'Smiling learner wearing earphones, comfortably speaking to Arya on the MySivi mobile app.',
          imagePrompt:
            'Close-up of a smiling Indian young adult wearing minimalist white earphones, holding a sleek smartphone displaying an active purple-gradient audio waveform, speaking comfortably and laughing with relief, soft sunset backlighting, cozy balcony, modern aesthetic, 9:16.',
          altText: 'Learner speaking happily into smartphone while using MySivi Arya conversational voice call.',
          fallbackSvgId: 'arya_call',
        },
        {
          frameIndex: 4,
          timecode: '12-15s',
          sceneDescription: 'Confident candidate speaking smoothly in a glass-walled conference room interview.',
          imagePrompt:
            'Dynamic side-angle shot of a confident Indian job candidate speaking expressively with open hand gestures across an office table, warm natural glass-wall daylight, modern tech office background, glowing smile of confidence, vertical 9:16.',
          altText: 'Confident candidate speaking fluently in a professional corporate interview setting.',
          fallbackSvgId: 'speaking_breakthrough',
        },
      ],
    },
  },
};

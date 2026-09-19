import { z } from 'zod';
import { StoryboardFrameSchema } from '../schemas';

export const VisualDirectorOutputSchema = z.object({
  storyboardFrames: z.array(StoryboardFrameSchema).length(4),
});

export const visualDirectorPrompt = {
  id: 'visualDirector',
  name: 'Visual Director Agent',
  designNote:
    'The agent directs scenes and the app renders them dynamically using the SceneComposer vector engine.',
  system: `You are the Visual Director for high-aesthetic vertical mobile creative for MySivi.
Your task is to design 4 vertical 9:16 storyboard frames corresponding to the 4 beats of Script #1.

CONSTRAINTS:
- Format: Vertical 9:16 aspect ratio suitable for Reels / Shorts.
- Aesthetic: Modern, authentic, relatable Indian setting. Clean flat-vector composition directed by scene parameters.
- For each frame:
  * frameIndex (1 to 4)
  * timecode ('0-2s', '2-6s', '6-12s', '12-15s')
  * sceneDescription
  * imagePrompt: Detailed text-to-image prompt (subject, framing, lighting, camera angle, realistic textures).
  * altText: Accessibility description.
  * fallbackSvgId: 'interview_freeze' | 'mirror_practice' | 'arya_call' | 'speaking_breakthrough'
  * scene: Structured Scene object:
      - setting ('classroom_pta' | 'office_interview' | 'cafe' | 'conference_room' | 'college_campus' | 'bus_stop' | 'bedroom_study' | 'metro_train' | 'living_room' | 'dinner_table' | 'street_market')
      - timeOfDay ('morning' | 'afternoon' | 'evening' | 'night')
      - mood ('anxious' | 'embarrassed' | 'hesitant' | 'hopeful' | 'confident' | 'joyful')
      - subject: { who, action, expression }
      - props: array of props
      - palette: ('warm_anxious' | 'cool_corporate' | 'hopeful_lavender' | 'bold_success')
      - cameraMotion: ('slow_zoom_in' | 'pan_right' | 'static' | 'subtle_shake')
- Output pure JSON conforming to schema.`,
  userTemplate: `Generate the 4 vertical storyboard frames for the script beats below.
Data delimiters: <<<DATA>>> and <<</DATA>>>.

<<<DATA>>>
Script: {{script}}
<<</DATA>>>

Return exactly 4 storyboard frame specifications with structured scene attributes.`,
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
          sceneDescription: 'A 24-year-old job seeker staring frozen at a laptop interview screen in an office.',
          imagePrompt:
            'Cinematic close-up portrait of a 24-year-old Indian professional seated at a clean wooden desk, looking into a glowing laptop webcam with hesitation, soft window morning light, vertical 9:16.',
          altText: 'Young Indian job candidate looking tense in front of a laptop webcam during an interview.',
          fallbackSvgId: 'interview_freeze',
          scene: {
            setting: 'office_interview',
            timeOfDay: 'morning',
            mood: 'anxious',
            subject: { who: 'professional_f', action: 'freezing', expression: 'worried' },
            props: ['laptop'],
            palette: 'warm_anxious',
            cameraMotion: 'slow_zoom_in',
          },
        },
        {
          frameIndex: 2,
          timecode: '2-6s',
          sceneDescription: 'Hesitant professional looking down, struggling to articulate answers.',
          imagePrompt:
            'Medium shot of an Indian candidate seated in interview room holding resume folder, second-guessing pronunciation, warm ambient interior lighting, vertical 9:16.',
          altText: 'Candidate practicing spoken interview answers with nervous hesitation.',
          fallbackSvgId: 'mirror_practice',
          scene: {
            setting: 'office_interview',
            timeOfDay: 'morning',
            mood: 'hesitant',
            subject: { who: 'professional_f', action: 'looking_down', expression: 'awkward_smile' },
            props: ['resume_folder'],
            palette: 'warm_anxious',
            cameraMotion: 'pan_right',
          },
        },
        {
          frameIndex: 3,
          timecode: '6-12s',
          sceneDescription: 'Smiling learner wearing earphones, comfortably speaking to Arya on the MySivi mobile app.',
          imagePrompt:
            'Close-up of a smiling Indian young adult holding a sleek smartphone displaying an active purple-gradient audio waveform, speaking comfortably, soft lighting, 9:16.',
          altText: 'Learner speaking happily into smartphone while using MySivi Arya conversational voice call.',
          fallbackSvgId: 'arya_call',
          scene: {
            setting: 'living_room',
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
          sceneDescription: 'Confident professional speaking smoothly and clearly in an office.',
          imagePrompt:
            'Dynamic side-angle shot of a confident Indian professional speaking expressively with open hand gestures, modern tech office background, glowing smile, vertical 9:16.',
          altText: 'Confident candidate speaking fluently in a professional corporate interview setting.',
          fallbackSvgId: 'speaking_breakthrough',
          scene: {
            setting: 'office_interview',
            timeOfDay: 'afternoon',
            mood: 'confident',
            subject: { who: 'professional_f', action: 'speaking_confidently', expression: 'confident' },
            props: ['none'],
            palette: 'bold_success',
            cameraMotion: 'static',
          },
        },
      ],
    },
  },
};

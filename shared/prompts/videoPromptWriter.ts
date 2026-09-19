import { z } from 'zod';
import { VideoShotPromptSchema } from '../schemas';

export const VideoPromptWriterOutputSchema = z.object({
  videoPrompts: z.array(VideoShotPromptSchema).length(4),
});

export const videoPromptWriterPrompt = {
  id: 'videoPromptWriter',
  name: 'Video Prompt Writer Agent',
  designNote:
    'Transforms storyboard frames into production-ready generative video prompts with precise camera movements, lighting cues, motion parameters, and negative prompts for tools like Google Veo and Runway Gen-3.',
  system: `You are the Lead Video Prompt Engineer specializing in generative AI video engines (Google Veo, Runway Gen-3, Kling, Sora).
Your job is to take the 4 storyboard beats and produce shot-by-shot text-to-video prompt specs ready for video generation engines.

EACH SHOT REQUIRES:
1. shot: identifier e.g. "Shot 1 (0-2s) — The Freeze Hook"
2. camera: e.g. "Slow push-in 50mm lens at eye level, subtle handheld drift"
3. lighting: e.g. "Cool screen glow on face contrasted with warm 3200K rim light"
4. motion: e.g. "Subject looks down with micro-tremor in jaw, then raises eyes to camera"
5. duration: e.g. "2 seconds, 24fps"
6. prompt: Complete text-to-video prompt with style keywords, physics, and subject motion.
7. negativePrompt: Universal negative prompts (e.g., "uncanny valley, plastic skin, distorted hands, morphing faces, text watermark, flicker").
- Output pure JSON conforming to schema.`,
  userTemplate: `Generate 4 generative video prompt specifications for the storyboard frames below.
Data delimiters: <<<DATA>>> and <<</DATA>>>.

<<<DATA>>>
Storyboard Frames: {{frames}}
<<</DATA>>>

Return exactly 4 prompt specifications.`,
  schema: VideoPromptWriterOutputSchema,
  fewShot: {
    input: {
      frames: '4 storyboard frames from Visual Director',
    },
    output: {
      videoPrompts: [
        {
          shot: 'Shot 1 (0-2s) — The Interview Freeze',
          camera: '50mm prime, slow push-in toward candidate eyes, eye-level angle, shallow depth of field (f/1.8).',
          lighting: 'Soft blue light from laptop screen casting cool highlights on face, warm overhead pendant lamp behind.',
          motion: 'Learner hesitates, swallows gently, lips part as if to answer then freeze with subtle vulnerability.',
          duration: '2.0 seconds, 24fps',
          prompt:
            'A realistic cinematic 24-year-old Indian professional seated in front of an open laptop, slow gentle zoom toward their eyes, expression shifting from hopeful to nervous hesitation, natural subtle facial micro-expressions, authentic skin pores, photorealistic, 4k vertical 9:16.',
          negativePrompt:
            'cartoon, 3D CGI, plastic doll skin, jerky camera, distorted fingers, extra limbs, low resolution, watermark, text overlay.',
        },
        {
          shot: 'Shot 2 (2-6s) — The Mirror Practice',
          camera: 'Medium shot, slow panning parallax movement behind bedroom door frame.',
          lighting: 'Warm afternoon sunlight streaming through sheer curtains creating soft dust motes.',
          motion: 'Learner raises resume paper, speaks a sentence to reflection, shakes head slightly and rubs temples.',
          duration: '4.0 seconds, 24fps',
          prompt:
            'Indian college student practicing speech in a modern bedroom mirror, holding paper resume, natural mouth movement articulating English words, subtle frustration transitioning to earnest focus, photorealistic 9:16.',
          negativePrompt:
            'flicker, bad anatomy, deformed eyes, blurry, amateur video, CGI artifacts, exaggerated anime emotions.',
        },
        {
          shot: 'Shot 3 (6-12s) — The Arya Voice Breakthrough',
          camera: 'Over-the-shoulder tilting down to smartphone screen then arcing to learner glowing profile.',
          lighting: 'Magical golden-hour warmth, soft purple reflection from MySivi waveform UI.',
          motion: 'Learner taps phone screen, speaks smoothly into wireless earphone mic, bursts into a relieved natural laugh.',
          duration: '6.0 seconds, 24fps',
          prompt:
            'Young Indian woman wearing white wireless earbuds speaking happily into smartphone, vibrant purple audio wave animation visible on screen, relaxed laughter, natural posture, soft bokeh background, hyper-realistic, 9:16.',
          negativePrompt:
            'overexposed, desaturated, fake smile, oversaturated neon, morphing hands, blurry phone screen.',
        },
        {
          shot: 'Shot 4 (12-15s) — Fluent Climax & CTA',
          camera: 'Dynamic low-angle dolly shot tracking candidate walking confidently into interview room.',
          lighting: 'Clean high-key modern architectural sunlight, glass wall reflections.',
          motion: 'Candidate extends hand with confident handshake, radiant smile, engaging in fluid conversation.',
          duration: '3.0 seconds, 24fps',
          prompt:
            'Indian candidate greeting interview panel with confident smile and firm handshake, contemporary glass office interior, natural confident body language, warm color grading, cinematic 9:16.',
          negativePrompt:
            'awkward pose, unnatural limbs, blurry background, strobe lighting, jittery frame rate.',
        },
      ],
    },
  },
};

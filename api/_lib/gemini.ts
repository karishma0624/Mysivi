import { GoogleGenAI } from '@google/genai';
import { ZodSchema } from 'zod';

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'paste_your_key_here') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

export function getTextModelName(): string {
  return process.env.GEMINI_TEXT_MODEL || 'gemini-2.5-flash';
}

export function getImageModelName(): string {
  return process.env.GEMINI_IMAGE_MODEL || 'imagen-3.0-generate-002';
}

export function isLiveTextEnabled(): boolean {
  return process.env.ENABLE_LIVE_TEXT !== 'false';
}

export function isLiveImagesEnabled(): boolean {
  return process.env.ENABLE_LIVE_IMAGES !== 'false';
}

export interface GenerateJsonOptions<T> {
  systemInstruction: string;
  prompt: string;
  schema: ZodSchema<T>;
  temperature?: number;
}

export interface GenerateJsonResponse<T> {
  success: boolean;
  data?: T;
  isQuota?: boolean;
  errorMessage?: string;
}

/**
 * Executes a structured JSON Gemini call with Zod validation and 1 automatic retry.
 */
export async function callGeminiJson<T>(
  options: GenerateJsonOptions<T>
): Promise<GenerateJsonResponse<T>> {
  if (!isLiveTextEnabled()) {
    return { success: false, errorMessage: 'Live text generation is disabled via ENABLE_LIVE_TEXT.' };
  }

  const ai = getGeminiClient();
  if (!ai) {
    return { success: false, errorMessage: 'GEMINI_API_KEY is not configured on the server.' };
  }

  const model = getTextModelName();
  const { systemInstruction, prompt, schema, temperature = 0.7 } = options;

  let attempt = 0;
  let currentPrompt = prompt;

  while (attempt < 2) {
    attempt++;
    try {
      const response = await ai.models.generateContent({
        model,
        contents: currentPrompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature,
        },
      });

      const responseText = response.text || '';
      if (!responseText) {
        throw new Error('Empty response received from Gemini model.');
      }

      // Parse JSON
      const parsedJson = JSON.parse(responseText);

      // Validate against Zod schema
      const validation = schema.safeParse(parsedJson);
      if (validation.success) {
        return { success: true, data: validation.data };
      }

      // Retry once by appending the validation error
      if (attempt === 1) {
        const errorSummary = validation.error.errors
          .map((e) => `${e.path.join('.')}: ${e.message}`)
          .join(', ');
        currentPrompt = `${prompt}\n\nPREVIOUS ATTEMPT VALIDATION ERROR:\n${errorSummary}\nPlease fix all schema errors and return valid JSON adhering strictly to the schema.`;
      } else {
        return {
          success: false,
          errorMessage: `JSON schema validation failed after retry: ${validation.error.message}`,
        };
      }
    } catch (err: unknown) {
      const errStr = String(err);
      const isQuota =
        errStr.includes('429') ||
        errStr.includes('RESOURCE_EXHAUSTED') ||
        errStr.includes('quota') ||
        errStr.includes('rate limit');

      if (isQuota) {
        return { success: false, isQuota: true, errorMessage: 'Gemini free tier quota limit reached.' };
      }

      if (attempt >= 2) {
        return { success: false, errorMessage: errStr };
      }
    }
  }

  return { success: false, errorMessage: 'Failed to generate valid content.' };
}

/**
 * Generates an image using Gemini Image model, returning a data URL or null on error.
 */
export async function callGeminiImage(
  prompt: string
): Promise<{ imageUrl: string | null; isQuota: boolean; error?: string }> {
  if (!isLiveImagesEnabled()) {
    return { imageUrl: null, isQuota: false, error: 'Live images disabled.' };
  }

  const ai = getGeminiClient();
  if (!ai) {
    return { imageUrl: null, isQuota: false, error: 'GEMINI_API_KEY not set.' };
  }

  const model = getImageModelName();

  try {
    const response = await ai.models.generateImages({
      model,
      prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: '9:16',
      },
    });

    const generatedImage = response.generatedImages?.[0]?.image;
    if (generatedImage?.imageBytes) {
      const dataUrl = `data:image/jpeg;base64,${generatedImage.imageBytes}`;
      return { imageUrl: dataUrl, isQuota: false };
    }

    return { imageUrl: null, isQuota: false, error: 'No image bytes returned.' };
  } catch (err: unknown) {
    const errStr = String(err);
    const isQuota =
      errStr.includes('429') ||
      errStr.includes('RESOURCE_EXHAUSTED') ||
      errStr.includes('quota');

    return { imageUrl: null, isQuota, error: errStr };
  }
}

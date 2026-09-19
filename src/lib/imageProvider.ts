import { Scene } from '@shared/types';

export interface ImageGenerationResult {
  imageUrl: string | null;
  isGenerated: boolean;
  label: 'AI-generated' | 'Illustrated scene';
  error?: string;
  isQuota?: boolean;
}

export interface ImageProvider {
  name: string;
  generateImage(prompt: string, scene?: Scene): Promise<ImageGenerationResult>;
}

export const QUOTA_CACHE_KEY = 'mysivi_image_quota_session_exceeded';

/**
 * None Provider (Default):
 * 100% free, instantaneous, deterministic SceneComposer vector illustrations.
 * Does not make external network requests or call paid models.
 */
export class NoneImageProvider implements ImageProvider {
  name = 'none';

  async generateImage(_prompt: string, _scene?: Scene): Promise<ImageGenerationResult> {
    return {
      imageUrl: null,
      isGenerated: false,
      label: 'Illustrated scene',
    };
  }
}

/**
 * Gemini Provider:
 * Only invoked if VITE_IMAGE_PROVIDER is explicitly set to 'gemini'.
 * If quota is exceeded (HTTP 429/403/limit 0), it caches the failure in sessionStorage
 * so no further requests are wasted for the remainder of the user session.
 */
export class GeminiImageProvider implements ImageProvider {
  name = 'gemini';

  async generateImage(prompt: string, scene?: Scene): Promise<ImageGenerationResult> {
    // 1. Session quota cache check
    if (typeof window !== 'undefined' && window.sessionStorage?.getItem(QUOTA_CACHE_KEY)) {
      return {
        imageUrl: null,
        isGenerated: false,
        label: 'Illustrated scene',
        isQuota: true,
        error: 'Daily project quota reached. Graceful illustrated scene active for session.',
      };
    }

    try {
      const res = await fetch('/api/studio/storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frameIndex: 1,
          imagePrompt: prompt,
          fallbackSvgId: 'interview_freeze',
          scene,
        }),
      });

      if (res.status === 429 || res.status === 403 || res.status === 404) {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          window.sessionStorage.setItem(QUOTA_CACHE_KEY, 'true');
        }
        return {
          imageUrl: null,
          isGenerated: false,
          label: 'Illustrated scene',
          isQuota: true,
          error: `HTTP ${res.status}: Quota reached`,
        };
      }

      const json = await res.json();
      if (json.success && json.data?.imageUrl && json.data?.isGenerated) {
        return {
          imageUrl: json.data.imageUrl,
          isGenerated: true,
          label: 'AI-generated',
        };
      }

      if (json.isQuota) {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          window.sessionStorage.setItem(QUOTA_CACHE_KEY, 'true');
        }
        return {
          imageUrl: null,
          isGenerated: false,
          label: 'Illustrated scene',
          isQuota: true,
        };
      }
    } catch {
      // Network failure: fall back to illustrated scene
    }

    return {
      imageUrl: null,
      isGenerated: false,
      label: 'Illustrated scene',
    };
  }
}

/**
 * Returns active ImageProvider based on VITE_IMAGE_PROVIDER environment variable.
 * Default is NoneImageProvider (SceneComposer vector engine).
 */
export function getImageProvider(): ImageProvider {
  const envProvider = (
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_IMAGE_PROVIDER
      ? String(import.meta.env.VITE_IMAGE_PROVIDER)
      : 'none'
  ).toLowerCase();

  if (envProvider === 'gemini') {
    return new GeminiImageProvider();
  }
  return new NoneImageProvider();
}

/**
 * Web Speech API Voiceover Synthesizer
 * Uses native SpeechSynthesis with language code matching (en-IN, hi-IN, ta-IN, etc.)
 * If the device has no matching voice or speech is unsupported, gracefully fails silently with notification.
 */

import { SupportedLanguage, getTtsLanguageCode } from '@shared/languages';

export interface TtsState {
  isSupported: boolean;
  hasMatchingVoice: boolean;
  activeVoiceName?: string;
  isSpeaking: boolean;
  message?: string;
}

class VoiceoverService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public isSupported(): boolean {
    return this.synth !== null;
  }

  public getCurrentUtterance(): SpeechSynthesisUtterance | null {
    return this.currentUtterance;
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  public findBestVoice(lang: SupportedLanguage): {
    voice: SpeechSynthesisVoice | null;
    status: TtsState;
  } {
    if (!this.synth) {
      return {
        voice: null,
        status: {
          isSupported: false,
          hasMatchingVoice: false,
          isSpeaking: false,
          message: 'Speech synthesis not supported in this browser.',
        },
      };
    }

    const langCode = getTtsLanguageCode(lang);
    const voices = this.getAvailableVoices();

    // Try exact match e.g. en-IN or hi-IN
    let match = voices.find(
      (v) => v.lang.toLowerCase() === langCode.toLowerCase()
    );

    // Try prefix match (e.g. "en" or "hi")
    if (!match) {
      const prefix = langCode.split('-')[0].toLowerCase();
      match = voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
    }

    // Try any English voice as fallback for Hinglish/Tanglish
    if (!match && (lang === 'Hinglish' || lang === 'Tanglish' || lang === 'English')) {
      match = voices.find((v) => v.lang.toLowerCase().startsWith('en'));
    }

    if (!match) {
      return {
        voice: null,
        status: {
          isSupported: true,
          hasMatchingVoice: false,
          isSpeaking: false,
          message: `No native ${lang} (${langCode}) voice installed on this device.`,
        },
      };
    }

    return {
      voice: match,
      status: {
        isSupported: true,
        hasMatchingVoice: true,
        activeVoiceName: match.name,
        isSpeaking: false,
      },
    };
  }

  public speak(
    text: string,
    lang: SupportedLanguage,
    onEnd?: () => void,
    onError?: (err: unknown) => void
  ): boolean {
    if (!this.synth) return false;

    this.stop();

    const { voice, status } = this.findBestVoice(lang);
    if (!status.hasMatchingVoice || !voice) {
      if (onError) onError(new Error(status.message || 'No matching voice'));
      return false;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.lang = voice.lang;
      utterance.rate = 1.05; // natural lively pacing
      utterance.pitch = 1.0;

      utterance.onend = () => {
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        this.currentUtterance = null;
        if (onError) onError(e);
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
      return true;
    } catch (err) {
      if (onError) onError(err);
      return false;
    }
  }

  public stop(): void {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {
        // Safe catch
      }
    }
    this.currentUtterance = null;
  }
}

export const ttsService = new VoiceoverService();

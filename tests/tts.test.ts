import { describe, it, expect } from 'vitest';
import { getTtsLanguageCode, LANGUAGES } from '../shared/languages';
import { ttsService } from '../src/lib/tts';

describe('Text-To-Speech (TTS) Engine', () => {
  it('returns valid BCP-47 Indian language codes', () => {
    expect(getTtsLanguageCode('English')).toBe('en-IN');
    expect(getTtsLanguageCode('Hinglish')).toBe('hi-IN');
    expect(getTtsLanguageCode('Tanglish')).toBe('ta-IN');
    expect(getTtsLanguageCode('Hindi')).toBe('hi-IN');
    expect(getTtsLanguageCode('Tamil')).toBe('ta-IN');
    expect(getTtsLanguageCode('Telugu')).toBe('te-IN');
    expect(getTtsLanguageCode('Kannada')).toBe('kn-IN');
  });

  it('marks Latin script properly for Hinglish and Tanglish', () => {
    expect(LANGUAGES.Hinglish.script).toBe('latin');
    expect(LANGUAGES.Tanglish.script).toBe('latin');
    expect(LANGUAGES.Hindi.script).toBe('indic');
    expect(LANGUAGES.Tamil.script).toBe('indic');
  });

  it('handles speak calls gracefully in jsdom environment without crash', () => {
    const result = ttsService.speak('Test voiceover', 'English');
    // In node/jsdom environment without native speechSynthesis, it returns false safely
    expect(typeof result).toBe('boolean');
  });
});

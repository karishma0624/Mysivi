export type SupportedLanguage =
  | 'English'
  | 'Hinglish'
  | 'Tanglish'
  | 'Hindi'
  | 'Tamil'
  | 'Telugu'
  | 'Kannada';

export interface LanguageMeta {
  id: SupportedLanguage;
  name: string;
  nativeName: string;
  script: 'latin' | 'indic';
  ttsLangCode: string;
  note: string;
}

export const LANGUAGES: Record<SupportedLanguage, LanguageMeta> = {
  English: {
    id: 'English',
    name: 'English (Indian context)',
    nativeName: 'English',
    script: 'latin',
    ttsLangCode: 'en-IN',
    note: 'Standard conversational English with Indian conversational cadence.',
  },
  Hinglish: {
    id: 'Hinglish',
    name: 'Hinglish (Hindi + English)',
    nativeName: 'Hinglish (Latin)',
    script: 'latin',
    ttsLangCode: 'hi-IN',
    note: 'Spoken Hindi-English code-switching strictly rendered in Latin script.',
  },
  Tanglish: {
    id: 'Tanglish',
    name: 'Tanglish (Tamil + English)',
    nativeName: 'Tanglish (Latin)',
    script: 'latin',
    ttsLangCode: 'ta-IN',
    note: 'Spoken Tamil-English code-switching strictly rendered in Latin script.',
  },
  Hindi: {
    id: 'Hindi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'indic',
    ttsLangCode: 'hi-IN',
    note: 'Devanagari script with natural spoken Hindi syntax.',
  },
  Tamil: {
    id: 'Tamil',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'indic',
    ttsLangCode: 'ta-IN',
    note: 'Tamil script for conversational Tamil practice context.',
  },
  Telugu: {
    id: 'Telugu',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'indic',
    ttsLangCode: 'te-IN',
    note: 'Telugu script for conversational Telugu practice context.',
  },
  Kannada: {
    id: 'Kannada',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    script: 'indic',
    ttsLangCode: 'kn-IN',
    note: 'Kannada script for conversational Kannada practice context.',
  },
};

export const LANGUAGE_OPTIONS = Object.keys(LANGUAGES) as SupportedLanguage[];

export function getTtsLanguageCode(lang: SupportedLanguage): string {
  return LANGUAGES[lang]?.ttsLangCode || 'en-IN';
}

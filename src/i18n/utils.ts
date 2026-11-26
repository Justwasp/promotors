import { en } from './en';
import { pt } from './pt';
import type { Locale, TranslationDictionary } from './types';

export function getTranslations(locale: Locale): TranslationDictionary {
  return locale === 'en' ? en : pt;
}

export function getAlternateLocalePath(locale: Locale): string {
  return locale === 'en' ? '/' : '/en/';
}

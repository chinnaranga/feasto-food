import { Language } from '../../types/i18n';
import { LOCALES_DATA } from './locales';

export const loadTranslations = async (lang: Language): Promise<Record<string, Record<string, string>>> => {
  return new Promise((resolve) => {
    // Simulating dynamic import/HTTP request latency for modular i18n bundles
    setTimeout(() => {
      const data = LOCALES_DATA[lang] || LOCALES_DATA['en'];
      resolve(data);
    }, 50);
  });
};

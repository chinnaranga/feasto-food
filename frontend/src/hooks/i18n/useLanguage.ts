import { useCallback } from 'react';
import { useI18nStore } from '../../store/i18n/i18nStore';
import { LOCALES_DATA } from '../../services/i18n/locales';
import { Language } from '../../types/i18n';

export const useLanguage = () => {
  const { language, translations, setLanguage, isLoading } = useI18nStore();

  // Dotted key resolution with parameter interpolation and fallback support
  const t = useCallback(
    (key: string, variables?: Record<string, string | number>): string => {
      const parts = key.split('.');
      let result: any = translations;

      // 1. Resolve path in active language translations
      for (const part of parts) {
        if (result && typeof result === 'object' && part in result) {
          result = result[part];
        } else {
          result = null;
          break;
        }
      }

      // 2. Fallback: Search default English directory
      if (result === null || typeof result !== 'string') {
        let fallbackResult: any = LOCALES_DATA['en'];
        for (const part of parts) {
          if (fallbackResult && typeof fallbackResult === 'object' && part in fallbackResult) {
            fallbackResult = fallbackResult[part];
          } else {
            fallbackResult = null;
            break;
          }
        }
        result = fallbackResult;
      }

      // 3. Fallback: Return raw key if not resolved anywhere
      if (result === null || typeof result !== 'string') {
        return key;
      }

      // 4. Perform variable bracket interpolation (e.g. {count} or {name})
      if (variables) {
        let interpolated = result;
        Object.entries(variables).forEach(([varKey, varVal]) => {
          interpolated = interpolated.replace(new RegExp(`{${varKey}}`, 'g'), String(varVal));
        });
        return interpolated;
      }

      return result;
    },
    [translations]
  );

  const changeLanguage = async (newLang: Language) => {
    await setLanguage(newLang);
  };

  return {
    language,
    t,
    changeLanguage,
    isLoading,
  };
};

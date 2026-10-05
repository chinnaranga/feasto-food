import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, Region, Currency, I18nState } from '../../types/i18n';
import { REGIONS_CONFIG, SUPPORTED_LANGUAGES } from '../../services/i18n/localeConfig';
import { LOCALES_DATA } from '../../services/i18n/locales';

interface I18nActions {
  setLanguage: (language: Language) => Promise<void>;
  setRegion: (region: Region) => Promise<void>;
  setCurrency: (currency: Currency) => void;
  setTimezone: (timezone: string) => void;
}

type I18nStoreState = I18nState & I18nActions;

export const useI18nStore = create<I18nStoreState>()(
  persist(
    (set) => ({
      language: 'en',
      region: 'IN',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      dir: 'ltr',
      translations: LOCALES_DATA['en'],
      isLoading: false,

      setLanguage: async (language) => {
        set({ isLoading: true });
        
        // Simulating lazy loading of locales
        const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === language);
        const direction = langConfig?.dir || 'ltr';

        // Set layout direction on HTML element
        document.documentElement.dir = direction;
        document.documentElement.lang = language;

        set({
          language,
          dir: direction,
          translations: LOCALES_DATA[language],
          isLoading: false,
        });
      },

      setRegion: async (region) => {
        set({ isLoading: true });
        const config = REGIONS_CONFIG[region];
        
        // Automatically cascade regional settings
        const language = config.defaultLanguage;
        const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === language);
        const direction = langConfig?.dir || 'ltr';

        document.documentElement.dir = direction;
        document.documentElement.lang = language;

        set({
          region,
          language,
          currency: config.currency,
          timezone: config.timezone,
          dir: direction,
          translations: LOCALES_DATA[language],
          isLoading: false,
        });
      },

      setCurrency: (currency) => set({ currency }),
      setTimezone: (timezone) => set({ timezone }),
    }),
    {
      name: 'feasto-i18n-preferences',
      partialize: (state) => ({
        language: state.language,
        region: state.region,
        currency: state.currency,
        timezone: state.timezone,
        dir: state.dir,
      }),
    }
  )
);

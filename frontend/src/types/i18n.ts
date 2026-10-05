export type Language = 'en' | 'hi' | 'es' | 'ar' | 'fr';

export type Region = 'IN' | 'US' | 'ES' | 'AE' | 'FR';

export type Currency = 'INR' | 'USD' | 'EUR' | 'AED';

export interface RegionConfig {
  name: string;
  flag: string;
  defaultLanguage: Language;
  currency: Currency;
  timezone: string;
  taxLabel: string;
  deliveryLabel: string;
  phonePlaceholder: string;
  addressFormat: 'street-city-zip' | 'zip-city-street' | 'sector-city';
}

export interface I18nState {
  language: Language;
  region: Region;
  currency: Currency;
  timezone: string;
  dir: 'ltr' | 'rtl';
  translations: Record<string, any>;
  isLoading: boolean;
}

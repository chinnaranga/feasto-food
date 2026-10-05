import { Language, Region, RegionConfig } from '../../types/i18n';

export const SUPPORTED_LANGUAGES: { code: Language; name: string; nativeName: string; flag: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇦🇪', dir: 'rtl' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
];

export const REGIONS_CONFIG: Record<Region, RegionConfig> = {
  IN: {
    name: 'India',
    flag: '🇮🇳',
    defaultLanguage: 'en',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    taxLabel: 'GST',
    deliveryLabel: 'Delivery Partner',
    phonePlaceholder: '+91 98765 43210',
    addressFormat: 'street-city-zip',
  },
  US: {
    name: 'United States',
    flag: '🇺🇸',
    defaultLanguage: 'en',
    currency: 'USD',
    timezone: 'America/New_York',
    taxLabel: 'Sales Tax',
    deliveryLabel: 'Courier',
    phonePlaceholder: '+1 (555) 019-2834',
    addressFormat: 'street-city-zip',
  },
  ES: {
    name: 'Spain',
    flag: '🇪🇸',
    defaultLanguage: 'es',
    currency: 'EUR',
    timezone: 'Europe/Madrid',
    taxLabel: 'VAT (IVA)',
    deliveryLabel: 'Repartidor',
    phonePlaceholder: '+34 612 345 678',
    addressFormat: 'street-city-zip',
  },
  AE: {
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    defaultLanguage: 'ar',
    currency: 'AED',
    timezone: 'Asia/Dubai',
    taxLabel: 'VAT',
    deliveryLabel: 'Driver',
    phonePlaceholder: '+971 50 123 4567',
    addressFormat: 'sector-city',
  },
  FR: {
    name: 'France',
    flag: '🇫🇷',
    defaultLanguage: 'fr',
    currency: 'EUR',
    timezone: 'Europe/Paris',
    taxLabel: 'TVA',
    deliveryLabel: 'Livreur',
    phonePlaceholder: '+33 6 12 34 56 78',
    addressFormat: 'street-city-zip',
  },
};

export const DEFAULT_LANGUAGE: Language = 'en';
export const DEFAULT_REGION: Region = 'IN';

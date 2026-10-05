import { useCallback } from 'react';
import { useI18nStore } from '../../store/i18n/i18nStore';

export const useCurrencyFormatter = () => {
  const { language, region, currency } = useI18nStore();

  const formatCurrency = useCallback(
    (value: number, customCurrency?: typeof currency): string => {
      const activeLocale = `${language}-${region}`;
      const activeCurrency = customCurrency || currency;
      
      try {
        return new Intl.NumberFormat(activeLocale, {
          style: 'currency',
          currency: activeCurrency,
          minimumFractionDigits: activeCurrency === 'INR' ? 0 : 2,
          maximumFractionDigits: 2,
        }).format(value);
      } catch (err) {
        // Safe Fallback formatting
        return `${activeCurrency === 'INR' ? '₹' : activeCurrency === 'USD' ? '$' : '€'}${value.toFixed(2)}`;
      }
    },
    [language, region, currency]
  );

  return { formatCurrency };
};

export const useDateFormatter = () => {
  const { language, region, timezone } = useI18nStore();

  const formatDate = useCallback(
    (date: Date | string | number, options?: Intl.DateTimeFormatOptions): string => {
      const activeLocale = `${language}-${region}`;
      const parsedDate = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

      const defaultOptions: Intl.DateTimeFormatOptions = {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: timezone,
        ...options,
      };

      try {
        return new Intl.DateTimeFormat(activeLocale, defaultOptions).format(parsedDate);
      } catch (err) {
        // Safe Fallback date conversion
        return parsedDate.toLocaleString();
      }
    },
    [language, region, timezone]
  );

  return { formatDate };
};

export const useNumberFormatter = () => {
  const { language, region } = useI18nStore();

  const formatNumber = useCallback(
    (value: number, options?: Intl.NumberFormatOptions): string => {
      const activeLocale = `${language}-${region}`;
      try {
        return new Intl.NumberFormat(activeLocale, options).format(value);
      } catch (err) {
        return String(value);
      }
    },
    [language, region]
  );

  return { formatNumber };
};

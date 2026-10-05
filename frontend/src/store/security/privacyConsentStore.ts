import { create } from 'zustand';
import {
  CookieConsentState,
  CookieCategoryKey,
  CURRENT_CONSENT_VERSION,
  DEFAULT_CONSENT_STATE,
  ACCEPT_ALL_CONSENT_STATE,
  REJECT_OPTIONAL_CONSENT_STATE,
} from '../../types/privacyConsent';
import { useSecurityStore } from './securityStore';
import { useSettingsStore } from '../settingsStore';

const STORAGE_KEY = 'feasto_cookie_consent_v1';
const COOKIE_NAME = 'feasto_consent_v1';

interface PrivacyConsentStoreState {
  consent: CookieConsentState;
  hasSavedConsent: boolean;
  isBannerOpen: boolean;
  isPreferencesModalOpen: boolean;
  draftPreferences: CookieConsentState;
  isConfirmationToastVisible: boolean;
  confirmationMessage: string;
  confirmationDetail: string;

  // Actions
  initializeConsent: () => void;
  openBanner: () => void;
  closeBanner: () => void;
  openPreferencesModal: () => void;
  closePreferencesModal: () => void;
  setDraftCategory: (key: CookieCategoryKey, value: boolean) => void;
  saveDraftPreferences: () => void;
  acceptAll: () => void;
  rejectOptional: () => void;
  dismissConfirmationToast: () => void;
  reopenFromConfirmation: () => void;
}

// Cookie helpers
const getStoredCookieConsent = (): CookieConsentState | null => {
  try {
    // 1. Try localStorage
    const rawLocal = localStorage.getItem(STORAGE_KEY);
    if (rawLocal) {
      const parsed = JSON.parse(rawLocal) as CookieConsentState;
      if (parsed && typeof parsed === 'object' && parsed.version) {
        return parsed;
      }
    }

    // 2. Try first-party cookie fallback
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(new RegExp(`(^|;\\s*)(${COOKIE_NAME})=([^;]*)`));
      if (match && match[3]) {
        const parsed = JSON.parse(decodeURIComponent(match[3])) as CookieConsentState;
        if (parsed && typeof parsed === 'object' && parsed.version) {
          return parsed;
        }
      }
    }
  } catch {
    // Storage unavailable or blocked
  }
  return null;
};

const persistConsent = (state: CookieConsentState): void => {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);

    if (typeof document !== 'undefined') {
      const maxAge = 365 * 24 * 60 * 60; // 1 year
      const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
      document.cookie = `${COOKIE_NAME}=${encodeURIComponent(serialized)}; path=/; max-age=${maxAge}; SameSite=Lax${secureFlag}`;
    }
  } catch {
    // Graceful fallback if storage is restricted
  }
};

let toastDismissTimer: ReturnType<typeof setTimeout> | null = null;

export const usePrivacyConsentStore = create<PrivacyConsentStoreState>((set, get) => {
  const initialStored = getStoredCookieConsent();
  const isVersionOutdated = initialStored ? initialStored.version !== CURRENT_CONSENT_VERSION : true;
  const initialValidConsent = initialStored && !isVersionOutdated ? initialStored : DEFAULT_CONSENT_STATE;
  const initialHasConsent = !!initialStored && !isVersionOutdated;

  return {
    consent: initialValidConsent,
    hasSavedConsent: initialHasConsent,
    isBannerOpen: !initialHasConsent,
    isPreferencesModalOpen: false,
    draftPreferences: initialValidConsent,
    isConfirmationToastVisible: false,
    confirmationMessage: '',
    confirmationDetail: '',

    initializeConsent: () => {
      const stored = getStoredCookieConsent();
      if (!stored) {
        set({
          consent: DEFAULT_CONSENT_STATE,
          hasSavedConsent: false,
          isBannerOpen: true,
          draftPreferences: DEFAULT_CONSENT_STATE,
        });
        return;
      }

      // Check versioning
      if (stored.version !== CURRENT_CONSENT_VERSION) {
        // Outdated consent: preserve previous choices where applicable, prompt re-consent
        const migrated: CookieConsentState = {
          ...DEFAULT_CONSENT_STATE,
          functional: stored.functional ?? true,
          analytics: stored.analytics ?? false,
          personalization: stored.personalization ?? false,
          marketing: stored.marketing ?? false,
          version: CURRENT_CONSENT_VERSION,
          updatedAt: '',
        };
        set({
          consent: migrated,
          hasSavedConsent: false,
          isBannerOpen: true,
          draftPreferences: migrated,
        });
      } else {
        set({
          consent: stored,
          hasSavedConsent: true,
          isBannerOpen: false,
          draftPreferences: stored,
        });
      }
    },

    openBanner: () => set({ isBannerOpen: true }),
    closeBanner: () => set({ isBannerOpen: false }),

    openPreferencesModal: () => {
      set((state) => ({
        isPreferencesModalOpen: true,
        draftPreferences: { ...state.consent },
      }));
      useSecurityStore.getState().addSecurityEvent('consent', 'Opened Privacy & Cookie Preferences Manager.');
    },

    closePreferencesModal: () => {
      set({ isPreferencesModalOpen: false });
    },

    setDraftCategory: (key: CookieCategoryKey, value: boolean) => {
      if (key === 'necessary') return; // Strictly necessary is locked ON
      set((state) => ({
        draftPreferences: {
          ...state.draftPreferences,
          [key]: value,
        },
      }));
    },

    saveDraftPreferences: () => {
      const draft = get().draftPreferences;
      const now = new Date().toISOString();
      const updatedConsent: CookieConsentState = {
        ...draft,
        necessary: true, // Always locked ON
        updatedAt: now,
        version: CURRENT_CONSENT_VERSION,
      };

      persistConsent(updatedConsent);

      // Sync with securityStore & settingsStore
      useSecurityStore.getState().setPrivacyPreference('cookieConsent', true);
      useSecurityStore.getState().setPrivacyPreference('personalizationConsent', updatedConsent.personalization);
      useSecurityStore.getState().setPrivacyPreference('marketingConsent', updatedConsent.marketing);
      useSettingsStore.getState().updatePrivacy({
        dataUsageAnalytics: updatedConsent.analytics,
        personalizedAds: updatedConsent.marketing,
      });

      useSecurityStore.getState().addSecurityEvent(
        'consent',
        `Saved privacy cookie preferences: [functional: ${updatedConsent.functional}, analytics: ${updatedConsent.analytics}, personalization: ${updatedConsent.personalization}, marketing: ${updatedConsent.marketing}]`
      );

      // Show confirmation toast
      if (toastDismissTimer) clearTimeout(toastDismissTimer);

      set({
        consent: updatedConsent,
        hasSavedConsent: true,
        isBannerOpen: false,
        isPreferencesModalOpen: false,
        isConfirmationToastVisible: true,
        confirmationMessage: 'Preferences saved',
        confirmationDetail: 'Your privacy preferences have been updated.',
      });

      toastDismissTimer = setTimeout(() => {
        set({ isConfirmationToastVisible: false });
      }, 4500);
    },

    acceptAll: () => {
      const now = new Date().toISOString();
      const allConsent: CookieConsentState = {
        ...ACCEPT_ALL_CONSENT_STATE,
        updatedAt: now,
      };

      persistConsent(allConsent);

      // Sync with securityStore & settingsStore
      useSecurityStore.getState().setPrivacyPreference('cookieConsent', true);
      useSecurityStore.getState().setPrivacyPreference('personalizationConsent', true);
      useSecurityStore.getState().setPrivacyPreference('marketingConsent', true);
      useSettingsStore.getState().updatePrivacy({
        dataUsageAnalytics: true,
        personalizedAds: true,
      });

      useSecurityStore.getState().addSecurityEvent('consent', 'Accepted all cookie categories.');

      if (toastDismissTimer) clearTimeout(toastDismissTimer);

      set({
        consent: allConsent,
        hasSavedConsent: true,
        isBannerOpen: false,
        isPreferencesModalOpen: false,
        draftPreferences: allConsent,
        isConfirmationToastVisible: true,
        confirmationMessage: 'All preferences accepted',
        confirmationDetail: 'All cookie categories have been enabled for your session.',
      });

      toastDismissTimer = setTimeout(() => {
        set({ isConfirmationToastVisible: false });
      }, 4500);
    },

    rejectOptional: () => {
      const now = new Date().toISOString();
      const rejectedConsent: CookieConsentState = {
        ...REJECT_OPTIONAL_CONSENT_STATE,
        updatedAt: now,
      };

      persistConsent(rejectedConsent);

      // Sync with securityStore & settingsStore
      useSecurityStore.getState().setPrivacyPreference('cookieConsent', true);
      useSecurityStore.getState().setPrivacyPreference('personalizationConsent', false);
      useSecurityStore.getState().setPrivacyPreference('marketingConsent', false);
      useSettingsStore.getState().updatePrivacy({
        dataUsageAnalytics: false,
        personalizedAds: false,
      });

      useSecurityStore.getState().addSecurityEvent(
        'consent',
        'Rejected all optional cookie categories. Strictly necessary cookies remain enabled.'
      );

      if (toastDismissTimer) clearTimeout(toastDismissTimer);

      set({
        consent: rejectedConsent,
        hasSavedConsent: true,
        isBannerOpen: false,
        isPreferencesModalOpen: false,
        draftPreferences: rejectedConsent,
        isConfirmationToastVisible: true,
        confirmationMessage: 'Optional cookies rejected',
        confirmationDetail: 'Only strictly necessary cookies remain active.',
      });

      toastDismissTimer = setTimeout(() => {
        set({ isConfirmationToastVisible: false });
      }, 4500);
    },

    dismissConfirmationToast: () => {
      if (toastDismissTimer) clearTimeout(toastDismissTimer);
      set({ isConfirmationToastVisible: false });
    },

    reopenFromConfirmation: () => {
      if (toastDismissTimer) clearTimeout(toastDismissTimer);
      set({ isConfirmationToastVisible: false });
      get().openPreferencesModal();
    },
  };
});

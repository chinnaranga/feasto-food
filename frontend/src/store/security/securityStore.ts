import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PrivacyPreferences, SessionStatus, SensitiveActionConfig, SecurityEvent } from '../../types/security';

interface SecurityState {
  sessionStatus: SessionStatus;
  idleTimeRemaining: number;
  isIdleWarningOpen: boolean;
  isReauthOpen: boolean;
  isConsentBannerOpen: boolean;
  privacyPreferences: PrivacyPreferences;
  securityEvents: SecurityEvent[];
  activeConfirmAction: { config: SensitiveActionConfig; onConfirm: () => void | Promise<void> } | null;
  reauthCallback: ((pass: string) => Promise<boolean>) | null;
}

interface SecurityActions {
  setSessionStatus: (status: SessionStatus) => void;
  tickIdleWarning: () => void;
  resetIdleTimer: () => void;
  setPrivacyPreference: (key: keyof PrivacyPreferences, val: boolean) => void;
  addSecurityEvent: (type: SecurityEvent['type'], description: string) => void;
  triggerSensitiveAction: (config: SensitiveActionConfig, onConfirm: () => void | Promise<void>) => void;
  clearSensitiveAction: () => void;
  closeConsentBanner: () => void;
  openConsentBanner: () => void;
  openReauthPrompt: (callback: (pass: string) => Promise<boolean>) => void;
  closeReauthPrompt: () => void;
}

type SecurityStoreState = SecurityState & SecurityActions;

const DEFAULT_PREFERENCES: PrivacyPreferences = {
  personalizationConsent: true,
  marketingConsent: false,
  locationConsent: false,
  cookieConsent: false,
};

export const useSecurityStore = create<SecurityStoreState>()(
  persist(
    (set, get) => ({
      sessionStatus: 'active',
      idleTimeRemaining: 60,
      isIdleWarningOpen: false,
      isReauthOpen: false,
      isConsentBannerOpen: true,
      privacyPreferences: DEFAULT_PREFERENCES,
      securityEvents: [],
      activeConfirmAction: null,
      reauthCallback: null,

      setSessionStatus: (sessionStatus) => set({ sessionStatus }),
      
      tickIdleWarning: () => {
        const current = get().idleTimeRemaining;
        if (current <= 1) {
          set({
            sessionStatus: 'expired',
            idleTimeRemaining: 0,
            isIdleWarningOpen: false,
          });
          get().addSecurityEvent('session', 'Session auto-expired due to user inactivity.');
        } else {
          set({ idleTimeRemaining: current - 1 });
        }
      },

      resetIdleTimer: () => {
        set({
          sessionStatus: 'active',
          idleTimeRemaining: 60,
          isIdleWarningOpen: false,
        });
      },

      setPrivacyPreference: (key, val) => {
        set((state) => {
          const nextPrefs = {
            ...state.privacyPreferences,
            [key]: val,
          };
          // Track updates
          return { privacyPreferences: nextPrefs };
        });
        get().addSecurityEvent('consent', `Updated privacy preference: ${key} to ${val}`);
      },

      addSecurityEvent: (type, description) => {
        const newEvent: SecurityEvent = {
          id: `sec-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type,
          description,
          actor: 'Current Session User',
          ip: '192.168.1.18',
        };
        set((state) => ({
          securityEvents: [newEvent, ...state.securityEvents].slice(0, 100), // retain last 100 logs
        }));
      },

      triggerSensitiveAction: (config, onConfirm) => {
        set({
          activeConfirmAction: { config, onConfirm },
        });
        get().addSecurityEvent('sensitive_action', `Triggered validation check for: ${config.title}`);
      },

      clearSensitiveAction: () => set({ activeConfirmAction: null }),

      closeConsentBanner: () => {
        set({ isConsentBannerOpen: false });
        set((state) => ({
          privacyPreferences: {
            ...state.privacyPreferences,
            cookieConsent: true,
          },
        }));
        get().addSecurityEvent('consent', 'Accepted privacy and essential cookie tracking consent.');
      },

      openConsentBanner: () => {
        set({ isConsentBannerOpen: true });
        get().addSecurityEvent('consent', 'Opened privacy cookie preferences banner.');
      },

      openReauthPrompt: (callback) => {
        set({
          isReauthOpen: true,
          reauthCallback: callback,
        });
        get().addSecurityEvent('auth', 'Identity validation re-authentication prompt opened.');
      },

      closeReauthPrompt: () => {
        set({
          isReauthOpen: false,
          reauthCallback: null,
        });
      },
    }),
    {
      name: 'feasto-security-compliance-prefs',
      partialize: (state) => ({
        privacyPreferences: state.privacyPreferences,
        isConsentBannerOpen: state.isConsentBannerOpen,
      }),
    }
  )
);
export { DEFAULT_PREFERENCES };

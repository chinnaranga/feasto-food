import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserSession {
  id: string;
  device: string;
  location: string;
  ip: string;
  isActive: boolean;
  lastActive: string;
}

export interface AccessibilityPrefs {
  reducedMotion: boolean;
  largeText: boolean;
  highContrast: boolean;
  screenReaderOptimized: boolean;
}

export interface PrivacyPrefs {
  profileVisibility: 'public' | 'private';
  dataUsageAnalytics: boolean;
  personalizedAds: boolean;
}

interface SettingsState {
  language: string;
  region: string;
  accessibility: AccessibilityPrefs;
  privacy: PrivacyPrefs;
  sessions: UserSession[];
  twoFactorEnabled: boolean;
  passwordLastChanged: string;

  setLanguage: (language: string) => void;
  setRegion: (region: string) => void;
  updateAccessibility: (prefs: Partial<AccessibilityPrefs>) => void;
  updatePrivacy: (prefs: Partial<PrivacyPrefs>) => void;
  terminateSession: (id: string) => void;
  changePassword: (oldPass: string, newPass: string) => Promise<boolean>;
  toggleTwoFactor: () => void;
  deleteAccount: () => Promise<boolean>;
}

const MOCK_SESSIONS: UserSession[] = [
  {
    id: 'sess-1',
    device: 'MacBook Pro (Chrome) — Current',
    location: 'Bengaluru, India',
    ip: '192.168.1.18',
    isActive: true,
    lastActive: 'Active now',
  },
  {
    id: 'sess-2',
    device: 'iPhone 15 Pro (Feasto App)',
    location: 'Mumbai, India',
    ip: '103.52.22.84',
    isActive: false,
    lastActive: 'Yesterday at 8:42 PM',
  },
  {
    id: 'sess-3',
    device: 'Windows PC (Edge Browser)',
    location: 'Bengaluru, India',
    ip: '192.168.1.42',
    isActive: false,
    lastActive: '5 days ago',
  },
];

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'en',
      region: 'in',
      accessibility: {
        reducedMotion: false,
        largeText: false,
        highContrast: false,
        screenReaderOptimized: false,
      },
      privacy: {
        profileVisibility: 'public',
        dataUsageAnalytics: true,
        personalizedAds: false,
      },
      sessions: MOCK_SESSIONS,
      twoFactorEnabled: false,
      passwordLastChanged: 'July 1, 2026',

      setLanguage: (language) => set({ language }),
      setRegion: (region) => set({ region }),
      updateAccessibility: (prefs) =>
        set((state) => ({
          accessibility: { ...state.accessibility, ...prefs },
        })),
      updatePrivacy: (prefs) =>
        set((state) => ({
          privacy: { ...state.privacy, ...prefs },
        })),
      terminateSession: (id) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
        })),
      changePassword: async (_oldPass, _newPass) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        set({ passwordLastChanged: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) });
        return true;
      },
      toggleTwoFactor: () => set((state) => ({ twoFactorEnabled: !state.twoFactorEnabled })),
      deleteAccount: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return true;
      },
    }),
    {
      name: 'feasto-settings',
    }
  )
);

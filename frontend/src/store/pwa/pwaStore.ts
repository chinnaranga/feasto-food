import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PwaState, PwaActions, NotificationPreferences } from '../../types/pwa';
import { PWA_STORE_PERSIST_KEY } from '../../constants/pwa';

const INITIAL_PREFERENCES: NotificationPreferences = {
  orderUpdates: true,
  deliveryStatus: true,
  membershipReminders: false,
  rewardsUpdates: false,
  offers: false,
  supportFollowups: true,
};

const getInitialOnlineStatus = () => {
  if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
    return !navigator.onLine;
  }
  return false;
};

export const usePwaStore = create<PwaState & PwaActions>()(
  persist(
    (set, get) => ({
      // Transient PWA State
      isOffline: getInitialOnlineStatus(),
      networkQuality: 'good',
      isUpdateAvailable: false,
      swRegistration: null,
      deferredPrompt: null,
      showInstallPrompt: false,
      showInstallGuide: false,

      // Persisted PWA State
      notificationPermission: typeof Notification !== 'undefined' ? Notification.permission : 'default',
      notificationPreferences: INITIAL_PREFERENCES,

      setOffline: (isOffline) => set({ isOffline }),
      setNetworkQuality: (networkQuality) => set({ networkQuality }),
      setUpdateAvailable: (isUpdateAvailable) => set({ isUpdateAvailable }),
      setSwRegistration: (swRegistration) => set({ swRegistration }),
      setDeferredPrompt: (deferredPrompt) => set({ deferredPrompt }),
      setShowInstallPrompt: (showInstallPrompt) => set({ showInstallPrompt }),
      setShowInstallGuide: (showInstallGuide) => set({ showInstallGuide }),
      setNotificationPermission: (notificationPermission) => set({ notificationPermission }),
      updateNotificationPreference: (key, value) =>
        set((state) => ({
          notificationPreferences: {
            ...state.notificationPreferences,
            [key]: value,
          },
        })),

      triggerInstall: async () => {
        const { deferredPrompt } = get();
        if (!deferredPrompt) {
          set({ showInstallGuide: true });
          return false;
        }

        try {
          await deferredPrompt.prompt();
          const choiceResult = await deferredPrompt.userChoice;
          // Clear prompt unconditionally once consumed to prevent duplicate prompt attempts
          set({ deferredPrompt: null, showInstallPrompt: false });
          return choiceResult.outcome === 'accepted';
        } catch (error) {
          set({ deferredPrompt: null, showInstallPrompt: false });
          return false;
        }
      },

      checkForUpdates: async () => {
        const { swRegistration } = get();
        if (swRegistration) {
          try {
            await swRegistration.update();
          } catch (error) {
            // Ignore in offline states
          }
        }
      },

      applyUpdate: async () => {
        const { swRegistration } = get();
        if (swRegistration && swRegistration.waiting) {
          swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
          let refreshing = false;
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
              refreshing = true;
              window.location.reload();
            }
          });
        }
      },
    }),
    {
      name: PWA_STORE_PERSIST_KEY,
      partialize: (state) => ({
        notificationPreferences: state.notificationPreferences,
        notificationPermission: state.notificationPermission,
      }),
    }
  )
);

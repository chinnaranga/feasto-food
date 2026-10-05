export type NetworkQuality = 'good' | 'slow' | 'none';

export interface NotificationPreferences {
  orderUpdates: boolean;
  deliveryStatus: boolean;
  membershipReminders: boolean;
  rewardsUpdates: boolean;
  offers: boolean;
  supportFollowups: boolean;
}

export interface PwaState {
  isOffline: boolean;
  networkQuality: NetworkQuality;
  isUpdateAvailable: boolean;
  swRegistration: ServiceWorkerRegistration | null;
  deferredPrompt: BeforeInstallPromptEvent | null;
  showInstallPrompt: boolean;
  showInstallGuide: boolean;
  notificationPermission: NotificationPermission;
  notificationPreferences: NotificationPreferences;
}

export interface PwaActions {
  setOffline: (offline: boolean) => void;
  setNetworkQuality: (quality: NetworkQuality) => void;
  setUpdateAvailable: (available: boolean) => void;
  setSwRegistration: (reg: ServiceWorkerRegistration | null) => void;
  setDeferredPrompt: (prompt: BeforeInstallPromptEvent | null) => void;
  setShowInstallPrompt: (show: boolean) => void;
  setShowInstallGuide: (show: boolean) => void;
  setNotificationPermission: (permission: NotificationPermission) => void;
  updateNotificationPreference: (key: keyof NotificationPreferences, value: boolean) => void;
  triggerInstall: () => Promise<boolean>;
  checkForUpdates: () => Promise<void>;
  applyUpdate: () => Promise<void>;
}

// Native PWA Install Prompt Event Interface
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Extend global Window interface to capture the install event
declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

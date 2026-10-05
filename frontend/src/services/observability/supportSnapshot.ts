import { redactSensitiveFields } from './redaction';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { useSupportStore } from '../../store/supportStore';
import { usePwaStore } from '../../store/pwa/pwaStore';
import { useReleaseStore } from '../../store/release/releaseStore';

export const createSupportSnapshot = (): string => {
  const authState = useAuthStore.getState();
  const userState = useUserStore.getState();
  const supportState = useSupportStore.getState();
  const pwaState = usePwaStore.getState();
  const releaseState = useReleaseStore.getState();

  const snapshot = {
    metadata: {
      timestamp: new Date().toISOString(),
      userAgent: window.navigator.userAgent,
      language: window.navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      windowSize: `${window.innerWidth}x${window.innerHeight}`,
      timezoneOffset: new Date().getTimezoneOffset(),
    },
    release: {
      version: releaseState.metadata.version,
      buildTimestamp: releaseState.metadata.buildTimestamp,
      commitHash: releaseState.metadata.commitHash,
      buildChannel: releaseState.metadata.buildChannel,
    },
    auth: {
      isAuthenticated: authState.isAuthenticated,
      isInitializing: authState.isInitializing,
      user: authState.user ? {
        uid: authState.user.uid,
        email: authState.user.email,
        displayName: authState.user.displayName,
      } : null,
    },
    pwa: {
      isOffline: pwaState.isOffline,
      networkQuality: pwaState.networkQuality,
      isUpdateAvailable: pwaState.isUpdateAvailable,
      notificationPermission: pwaState.notificationPermission,
    },
    user: {
      profile: userState.profile ? {
        joinedDate: userState.profile.joinedDate,
      } : null,
      favoritesCount: userState.favorites?.length || 0,
      activeOrdersCount: userState.activeOrders?.length || 0,
      pastOrdersCount: userState.pastOrders?.length || 0,
      notificationPrefs: userState.notificationPrefs,
      dietaryPrefs: userState.dietaryPrefs,
    },
    support: {
      ticketsCount: supportState.tickets?.length || 0,
      openTicketsCount: supportState.tickets?.filter((t) => t.status === 'open').length || 0,
    },
  };

  // Perform a deep-redaction of any user credentials, names, or addresses that might slip through
  const redactedSnapshot = redactSensitiveFields(snapshot);

  return JSON.stringify(redactedSnapshot, null, 2);
};

export const copySnapshotToClipboard = async (): Promise<boolean> => {
  try {
    const snapshotText = createSupportSnapshot();
    await navigator.clipboard.writeText(snapshotText);
    return true;
  } catch (error) {
    return false;
  }
};

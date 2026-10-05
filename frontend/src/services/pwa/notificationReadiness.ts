import { usePwaStore } from '../../store/pwa/pwaStore';

export const isNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;
};

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isNotificationSupported()) {
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    usePwaStore.getState().setNotificationPermission(permission);
    return permission;
  } catch (error) {
    return 'default';
  }
};

/**
 * Simulator to verify Push Notification Readiness.
 * Schedules or triggers a mock native notification after a short delay
 * to simulate server-side push events.
 */
export const simulatePushNotification = async (
  type: 'order_update' | 'delivery' | 'reward' | 'offer' | 'support',
  title: string,
  body: string,
  actionUrl: string = '/'
): Promise<boolean> => {
  if (!isNotificationSupported()) {
    return false;
  }

  const { notificationPermission, notificationPreferences } = usePwaStore.getState();

  // If permission is not granted, fail silently
  if (notificationPermission !== 'granted') {
    return false;
  }

  // Verify preference-based opt-in limits
  if (type === 'order_update' && !notificationPreferences.orderUpdates) return false;
  if (type === 'delivery' && !notificationPreferences.deliveryStatus) return false;
  if (type === 'reward' && !notificationPreferences.rewardsUpdates) return false;
  if (type === 'offer' && !notificationPreferences.offers) return false;
  if (type === 'support' && !notificationPreferences.supportFollowups) return false;

  try {
    const reg = await navigator.serviceWorker.ready;
    
    reg.showNotification(title, {
      body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      data: { actionUrl },
      tag: `feasto-${type}`,
      renotify: true,
      actions: [
        { action: 'open', title: 'View Details' }
      ]
    } as any);
    
    return true;
  } catch (error) {
    // If native registration display fails, fallback to standard web Notification
    try {
      new Notification(title, { body, icon: '/favicon.svg' });
      return true;
    } catch (e) {
      return false;
    }
  }
};

import { usePwaStore } from '../../store/pwa/pwaStore';
import { requestNotificationPermission, simulatePushNotification } from '../../services/pwa/notificationReadiness';

export const useNotificationPermission = () => {
  const permission = usePwaStore((state) => state.notificationPermission);
  const preferences = usePwaStore((state) => state.notificationPreferences);
  const setNotificationPermission = usePwaStore((state) => state.setNotificationPermission);
  const updatePreference = usePwaStore((state) => state.updateNotificationPreference);

  const requestPermission = async (): Promise<NotificationPermission> => {
    const result = await requestNotificationPermission();
    setNotificationPermission(result);
    return result;
  };

  const simulatePush = async (
    type: 'order_update' | 'delivery' | 'reward' | 'offer' | 'support',
    title: string,
    body: string,
    actionUrl?: string
  ): Promise<boolean> => {
    return simulatePushNotification(type, title, body, actionUrl);
  };

  return {
    permission,
    preferences,
    isGranted: permission === 'granted',
    isDenied: permission === 'denied',
    isDefault: permission === 'default',
    requestPermission,
    updatePreference,
    simulatePush,
  };
};

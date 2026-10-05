import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './authStore';
import { firestoreService } from '../services/firebase/firestoreService';
import { observabilityClient } from '../services/observability/observabilityClient';

export type NotificationType = 'order_update' | 'promotion' | 'suggestion' | 'support' | 'system';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: NotificationType;
  read: boolean;
  actionUrl?: string;
  meta?: {
    orderId?: string;
    ticketId?: string;
    deviceName?: string;
  };
}

interface NotificationState {
  notifications: Notification[];
  activeFilter: 'all' | NotificationType;
  unreadCount: () => number;
  setActiveFilter: (filter: 'all' | NotificationType) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  subscribeNotifications: (uid: string) => void;
  unsubscribeNotifications: () => void;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    title: 'Order Delivered 🎉',
    message: 'Your order #FST-894021 from Sora Sushi has been successfully delivered by your rider, Rohan.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    type: 'order_update',
    read: false,
    actionUrl: '/orders/FST-894021/track',
    meta: { orderId: 'FST-894021' },
  },
  {
    id: 'notif-2',
    title: 'Refund Approved 💳',
    message: 'Good news! Your refund request for the missing item in order #FST-743021 has been approved and processed back to your original payment method.',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    type: 'support',
    read: false,
    actionUrl: '/support',
    meta: { ticketId: 'TCK-2041' },
  },
  {
    id: 'notif-3',
    title: 'Healthy Bowls recommendation near you 🥗',
    message: 'Based on your Vegan dietary preference, Green Garden Cafe just launched a "Superfood Detox Bowl" that matches your goals. Get it now!',
    timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    type: 'suggestion',
    read: true,
    actionUrl: '/discover',
  },
];

let notificationsUnsubscribe: (() => void) | null = null;

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: MOCK_NOTIFICATIONS,
      activeFilter: 'all',

      unreadCount: () => {
        return get().notifications.filter((n) => !n.read).length;
      },

      setActiveFilter: (activeFilter) => set({ activeFilter }),

      subscribeNotifications: (uid) => {
        get().unsubscribeNotifications();

        notificationsUnsubscribe = firestoreService.listenCollection(
          `users/${uid}/notifications`,
          (snap) => {
            const list: Notification[] = [];
            snap.forEach((doc) => {
              list.push({ ...doc.data(), id: doc.id } as Notification);
            });
            list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            set({ notifications: list.length > 0 ? list : MOCK_NOTIFICATIONS });
          },
          (err) => {
            observabilityClient.captureError(err, 'network', {
              severity: 'warn',
              failedRequestType: 'firestore-notifications-read',
            });
            console.warn('⚠️ Cloud Firestore: user notifications read restricted. Using persistent cache.', err.message);
          }
        );
      },

      unsubscribeNotifications: () => {
        if (notificationsUnsubscribe) {
          notificationsUnsubscribe();
          notificationsUnsubscribe = null;
        }
      },

      markAsRead: (id) => {
        const uid = useAuthStore.getState().user?.uid;
        if (uid) {
          firestoreService.setDocument(`users/${uid}/notifications/${id}`, { read: true });
        } else {
          set((state) => ({
            notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
          }));
        }
      },

      markAllAsRead: () => {
        const uid = useAuthStore.getState().user?.uid;
        const list = get().notifications;
        if (uid) {
          list.forEach((n) => {
            if (!n.read) {
              firestoreService.setDocument(`users/${uid}/notifications/${n.id}`, { read: true });
            }
          });
        } else {
          set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
          }));
        }
      },

      clearAll: () => {
        const uid = useAuthStore.getState().user?.uid;
        const list = get().notifications;
        if (uid) {
          list.forEach((n) => {
            firestoreService.deleteDocument(`users/${uid}/notifications/${n.id}`);
          });
        } else {
          set({ notifications: [] });
        }
      },

      addNotification: (notification) => {
        const uid = useAuthStore.getState().user?.uid;
        const id = `notif-${Date.now()}`;
        const newNotification: Notification = {
          ...notification,
          id,
          timestamp: new Date().toISOString(),
          read: false,
        };

        if (uid) {
          firestoreService.setDocument(`users/${uid}/notifications/${id}`, newNotification);
        } else {
          set((state) => ({
            notifications: [newNotification, ...state.notifications],
          }));
        }
      },
    }),
    {
      name: 'feasto-notifications-v2',
    }
  )
);

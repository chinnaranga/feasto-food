import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, SavedAddress, PaymentMethod } from './cartStore';
import { useAuthStore } from './authStore';
import { firestoreService } from '../services/firebase/firestoreService';
import { observabilityClient } from '../services/observability/observabilityClient';

export type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'dispatched' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  discount: number;
  total: number;
  status: OrderStatus;
  eta: number; // minutes remaining
  address: SavedAddress;
  paymentMethod: PaymentMethod;
  placedAt: string;
  deliveredAt?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  joinedDate: string;
}

export interface NotificationPreferences {
  orderUpdates: boolean;
  promotions: boolean;
  dietaryInsights: boolean;
  weeklyRecaps: boolean;
}

export interface UserState {
  profile: UserProfile;
  addresses: SavedAddress[];
  favorites: string[]; // restaurant IDs
  activeOrders: Order[];
  pastOrders: Order[];
  notificationPrefs: NotificationPreferences;
  dietaryPrefs: string[];

  // Real-time synchronization hooks
  subscribeUserData: (uid: string) => void;
  unsubscribeUserData: () => void;

  // Profile actions
  updateProfile: (profile: Partial<UserProfile>) => void;

  // Address CRUD
  addAddress: (address: Omit<SavedAddress, 'id'>) => void;
  updateAddress: (id: string, address: Partial<SavedAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Favorites
  toggleFavorite: (restaurantId: string) => void;

  // Orders
  placeOrder: (order: Omit<Order, 'id' | 'status' | 'eta' | 'placedAt'>) => string;
  updateOrderStatus: (orderId: string, status: OrderStatus, eta?: number) => void;
  cancelOrder: (orderId: string) => void;

  // Preferences
  updateNotificationPrefs: (prefs: Partial<NotificationPreferences>) => void;
  toggleDietaryPref: (pref: string) => void;
}

const EMPTY_PROFILE: UserProfile = {
  name: '',
  email: '',
  phone: '',
  joinedDate: '',
};

let profileUnsubscribe: (() => void) | null = null;
let addressesUnsubscribe: (() => void) | null = null;
let ordersUnsubscribe: (() => void) | null = null;

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: EMPTY_PROFILE,
      addresses: [],
      favorites: [],
      activeOrders: [],
      pastOrders: [],
      notificationPrefs: {
        orderUpdates: true,
        promotions: false,
        dietaryInsights: true,
        weeklyRecaps: false,
      },
      dietaryPrefs: [],

      subscribeUserData: (uid) => {
        get().unsubscribeUserData();

        // 1. Listen to Profile details
        profileUnsubscribe = firestoreService.listenDoc(
          `users/${uid}`,
          (snap) => {
            if (snap.exists()) {
              const data = snap.data();
              set({
                profile: data.profile || EMPTY_PROFILE,
                favorites: data.favorites || [],
                notificationPrefs: data.notificationPrefs || {
                  orderUpdates: true,
                  promotions: false,
                  dietaryInsights: true,
                  weeklyRecaps: false,
                },
                dietaryPrefs: data.dietaryPrefs || [],
              });
            } else {
              const initVal = {
                profile: {
                  name: useAuthStore.getState().user?.displayName || '',
                  email: useAuthStore.getState().user?.email || '',
                  phone: '',
                  avatar: '',
                  joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                },
                favorites: [],
                notificationPrefs: {
                  orderUpdates: true,
                  promotions: false,
                  dietaryInsights: true,
                  weeklyRecaps: false,
                },
                dietaryPrefs: [],
              };
              firestoreService.setDocument(`users/${uid}`, initVal).catch(() => {});
              set(initVal);
            }
          },
          () => {}
        );

        // 2. Listen to Addresses
        addressesUnsubscribe = firestoreService.listenCollection(
          `users/${uid}/addresses`,
          (snapshot) => {
            const addrs = snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }) as SavedAddress);
            set({ addresses: addrs });
          },
          () => set({ addresses: [] })
        );

        // 3. Listen to User Orders
        ordersUnsubscribe = firestoreService.listenCollection(
          `users/${uid}/orders`,
          (snapshot) => {
            const orders = snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }) as Order);
            const active = orders.filter((o: Order) => ['placed', 'confirmed', 'preparing', 'dispatched'].includes(o.status));
            const past = orders.filter((o: Order) => ['delivered', 'cancelled'].includes(o.status));
            set({ activeOrders: active, pastOrders: past });
          },
          () => set({ activeOrders: [], pastOrders: [] })
        );
      },

      unsubscribeUserData: () => {
        if (profileUnsubscribe) {
          profileUnsubscribe();
          profileUnsubscribe = null;
        }
        if (addressesUnsubscribe) {
          addressesUnsubscribe();
          addressesUnsubscribe = null;
        }
        if (ordersUnsubscribe) {
          ordersUnsubscribe();
          ordersUnsubscribe = null;
        }
      },

      updateProfile: (updatedFields) => {
        const newProfile = { ...get().profile, ...updatedFields };
        set({ profile: newProfile });

        const uid = useAuthStore.getState().user?.uid;
        if (uid) {
          firestoreService.updateDocument(`users/${uid}`, { profile: newProfile }).catch(() => {});
        }
      },

      addAddress: (addressData) => {
        const isFirst = get().addresses.length === 0;
        const newId = `addr-${Date.now()}`;
        const newAddress: SavedAddress = {
          ...addressData,
          id: newId,
          isDefault: isFirst ? true : addressData.isDefault,
        };

        const addresses = [...get().addresses, newAddress];
        set({ addresses });

        const uid = useAuthStore.getState().user?.uid;
        if (uid) {
          firestoreService.setDocument(`users/${uid}/addresses/${newId}`, newAddress).catch(() => {});
        }
      },

      updateAddress: (id, addressData) => {
        const addresses = get().addresses.map((a) => (a.id === id ? { ...a, ...addressData } : a));
        set({ addresses });

        const uid = useAuthStore.getState().user?.uid;
        if (uid) {
          firestoreService.updateDocument(`users/${uid}/addresses/${id}`, addressData).catch(() => {});
        }
      },

      deleteAddress: (id) => {
        const addresses = get().addresses.filter((a) => a.id !== id);
        set({ addresses });

        const uid = useAuthStore.getState().user?.uid;
        if (uid) {
          firestoreService.deleteDocument(`users/${uid}/addresses/${id}`).catch(() => {});
        }
      },

      setDefaultAddress: (id) => {
        const addresses = get().addresses.map((a) => ({ ...a, isDefault: a.id === id }));
        set({ addresses });

        const uid = useAuthStore.getState().user?.uid;
        if (uid) {
          addresses.forEach((addr) => {
            firestoreService.updateDocument(`users/${uid}/addresses/${addr.id}`, { isDefault: addr.isDefault }).catch(() => {});
          });
        }
      },

      toggleFavorite: (restaurantId) => {
        const favorites = get().favorites.includes(restaurantId)
          ? get().favorites.filter((id) => id !== restaurantId)
          : [...get().favorites, restaurantId];

        set({ favorites });

        const uid = useAuthStore.getState().user?.uid;
        if (uid) {
          firestoreService.updateDocument(`users/${uid}`, { favorites }).catch(() => {});
        }
      },

      placeOrder: (orderData) => {
        const id = `FST-${Math.floor(100000 + Math.random() * 900000)}`;
        const newOrder: Order = {
          ...orderData,
          id,
          status: 'placed',
          eta: 35,
          placedAt: new Date().toISOString(),
        };

        const activeOrders = [newOrder, ...get().activeOrders];
        set({ activeOrders });

        const uid = useAuthStore.getState().user?.uid;
        if (uid) {
          firestoreService.setDocument(`users/${uid}/orders/${id}`, newOrder).catch(() => {});
          firestoreService.setDocument(`orders/${id}`, { ...newOrder, userId: uid }).catch(() => {});
        }

        observabilityClient.captureSystemEvent('interaction', `Order placed: ${id}`);

        return id;
      },

      updateOrderStatus: (orderId, status, eta) => {
        set((state) => {
          const update = (orderList: Order[]) =>
            orderList.map((o) => (o.id === orderId ? { ...o, status, ...(eta !== undefined && { eta }) } : o));

          const allOrders = update([...state.activeOrders, ...state.pastOrders]);
          return {
            activeOrders: allOrders.filter((o) => ['placed', 'confirmed', 'preparing', 'dispatched'].includes(o.status)),
            pastOrders: allOrders.filter((o) => ['delivered', 'cancelled'].includes(o.status)),
          };
        });

        const uid = useAuthStore.getState().user?.uid;
        if (uid) {
          const payload: any = { status };
          if (eta !== undefined) payload.eta = eta;
          if (status === 'delivered') payload.deliveredAt = new Date().toISOString();

          firestoreService.updateDocument(`users/${uid}/orders/${orderId}`, payload).catch(() => {});
          firestoreService.updateDocument(`orders/${orderId}`, payload).catch(() => {});
        }
      },

      cancelOrder: (orderId) => {
        get().updateOrderStatus(orderId, 'cancelled', 0);
      },

      updateNotificationPrefs: (prefs) => {
        const notificationPrefs = { ...get().notificationPrefs, ...prefs };
        set({ notificationPrefs });

        const uid = useAuthStore.getState().user?.uid;
        if (uid) {
          firestoreService.updateDocument(`users/${uid}`, { notificationPrefs }).catch(() => {});
        }
      },

      toggleDietaryPref: (pref) => {
        const dietaryPrefs = get().dietaryPrefs.includes(pref)
          ? get().dietaryPrefs.filter((p) => p !== pref)
          : [...get().dietaryPrefs, pref];

        set({ dietaryPrefs });

        const uid = useAuthStore.getState().user?.uid;
        if (uid) {
          firestoreService.updateDocument(`users/${uid}`, { dietaryPrefs }).catch(() => {});
        }
      },
    }),
    {
      name: 'feasto-user-storage',
    }
  )
);

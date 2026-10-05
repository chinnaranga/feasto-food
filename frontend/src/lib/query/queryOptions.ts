/**
 * F0 — Query Options Factory
 *
 * Centralizes the queryKey + queryFn pair for each domain query.
 * Use these with useQuery({ ...queryOptions.users.me() }) so that
 * keys and fetchers are always in sync.
 */
import { queryOptions as tanstackQueryOptions } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import {
  authApi,
  userApi,
  restaurantApi,
  menuApi,
  orderApi,
  riderApi,
  trackingApi,
  notificationApi,
  adminApi,
} from '@/services/api';

// ─── AUTH ────────────────────────────────────────────────────────────────────
export const authQueryOptions = {
  me: () =>
    tanstackQueryOptions({
      queryKey: queryKeys.users.me,
      queryFn: () => authApi.getCurrentUser(),
      staleTime: 1000 * 60 * 10, // 10 minutes — session data changes rarely
    }),
};

// ─── USERS ───────────────────────────────────────────────────────────────────
export const userQueryOptions = {
  profile: () =>
    tanstackQueryOptions({
      queryKey: queryKeys.users.me,
      queryFn: () => userApi.getProfile(),
    }),
};

// ─── RESTAURANTS ─────────────────────────────────────────────────────────────
export const restaurantQueryOptions = {
  all: () =>
    tanstackQueryOptions({
      queryKey: queryKeys.restaurants.all,
      queryFn: () => restaurantApi.getRestaurants(),
      staleTime: 1000 * 60 * 5,
    }),

  detail: (restaurantId: string) =>
    tanstackQueryOptions({
      queryKey: queryKeys.restaurants.detail(restaurantId),
      queryFn: () => restaurantApi.getRestaurantById(restaurantId),
      enabled: !!restaurantId,
    }),
};

// ─── MENUS ───────────────────────────────────────────────────────────────────
export const menuQueryOptions = {
  byRestaurant: (restaurantId: string) =>
    tanstackQueryOptions({
      queryKey: queryKeys.menus.list(restaurantId),
      queryFn: () => menuApi.getMenuByRestaurant(restaurantId),
      enabled: !!restaurantId,
    }),
};

// ─── ORDERS ──────────────────────────────────────────────────────────────────
export const orderQueryOptions = {
  list: () =>
    tanstackQueryOptions({
      queryKey: queryKeys.orders.list,
      queryFn: () => orderApi.getOrders(),
      staleTime: 0, // Always fresh — order list changes frequently
    }),

  detail: (orderId: string) =>
    tanstackQueryOptions({
      queryKey: queryKeys.orders.detail(orderId),
      queryFn: () => orderApi.getOrderById(orderId),
      enabled: !!orderId,
      staleTime: 0,
    }),
};

// ─── TRACKING ────────────────────────────────────────────────────────────────
export const trackingQueryOptions = {
  byOrder: (orderId: string) =>
    tanstackQueryOptions({
      queryKey: queryKeys.orders.tracking(orderId),
      queryFn: () => trackingApi.getTrackingByOrder(orderId),
      enabled: !!orderId,
      refetchInterval: 15_000, // Poll every 15s as a fallback to socket updates
      staleTime: 0,
    }),
};

// ─── RIDERS ──────────────────────────────────────────────────────────────────
export const riderQueryOptions = {
  offers: () =>
    tanstackQueryOptions({
      queryKey: queryKeys.riders.offers,
      queryFn: () => riderApi.getOffers(),
      staleTime: 0,
    }),

  assignments: () =>
    tanstackQueryOptions({
      queryKey: queryKeys.riders.assignments,
      queryFn: () => riderApi.getAssignments(),
      staleTime: 0,
    }),
};

// ─── NOTIFICATIONS ───────────────────────────────────────────────────────────
export const notificationQueryOptions = {
  list: () =>
    tanstackQueryOptions({
      queryKey: queryKeys.notifications.list,
      queryFn: () => notificationApi.getNotifications(),
      staleTime: 0,
    }),
};

// ─── ADMIN ───────────────────────────────────────────────────────────────────
export const adminQueryOptions = {
  overview: () =>
    tanstackQueryOptions({
      queryKey: queryKeys.admin.overview,
      queryFn: () => adminApi.getOverview(),
    }),

  users: () =>
    tanstackQueryOptions({
      queryKey: queryKeys.admin.users,
      queryFn: () => adminApi.listUsers(),
    }),
};

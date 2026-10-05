export const SOCKET_NAMESPACES = {
  ORDERS: '/orders',
  RIDERS: '/riders',
  RESTAURANTS: '/restaurants',
  NOTIFICATIONS: '/notifications',
  ADMIN: '/admin',
} as const;

export type SocketNamespace = (typeof SOCKET_NAMESPACES)[keyof typeof SOCKET_NAMESPACES];

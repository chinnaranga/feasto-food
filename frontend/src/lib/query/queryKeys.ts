export const queryKeys = {
  // USERS
  users: {
    me: ['users', 'me'] as const,
    detail: (userId: string) => ['users', 'detail', userId] as const,
  },

  // RESTAURANTS
  restaurants: {
    all: ['restaurants', 'all'] as const,
    detail: (id: string) => ['restaurants', 'detail', id] as const,
    branches: (id: string) => ['restaurants', 'branches', id] as const,
  },

  // MENUS
  menus: {
    list: (restaurantId: string) => ['menus', 'list', restaurantId] as const,
    detail: (id: string) => ['menus', 'detail', id] as const,
  },

  // ORDERS
  orders: {
    list: ['orders', 'list'] as const,
    detail: (orderId: string) => ['orders', 'detail', orderId] as const,
    tracking: (orderId: string) => ['orders', 'tracking', orderId] as const,
  },

  // RIDERS
  riders: {
    offers: ['riders', 'offers'] as const,
    assignments: ['riders', 'assignments'] as const,
  },

  // NOTIFICATIONS
  notifications: {
    list: ['notifications', 'list'] as const,
    unread: ['notifications', 'unread'] as const,
  },

  // PAYMENTS
  payments: {
    detail: (paymentId: string) => ['payments', 'detail', paymentId] as const,
  },

  // ADMIN
  admin: {
    overview: ['admin', 'overview'] as const,
    users: ['admin', 'users'] as const,
    restaurants: ['admin', 'restaurants'] as const,
    riders: ['admin', 'riders'] as const,
  },
};

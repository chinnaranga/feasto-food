export const socketRooms = {
  user: (userId: string) => `user:${userId}`,
  restaurant: (restaurantId: string) => `restaurant:${restaurantId}`,
  branch: (branchId: string) => `branch:${branchId}`,
  rider: (riderId: string) => `rider:${riderId}`,
  order: (orderId: string) => `order:${orderId}`,
  admin: (adminId: string) => `admin:${adminId}`,
  adminOperations: 'admin:operations',
  adminFinance: 'admin:finance',
};

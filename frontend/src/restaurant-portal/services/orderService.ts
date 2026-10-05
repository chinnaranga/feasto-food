export const orderService = {
  getLiveOrders: async (_restaurantId: string): Promise<any[]> => {
    return Promise.resolve([]);
  },
  updateOrderStatus: async (orderId: string, status: string): Promise<any> => {
    return Promise.resolve({ orderId, status });
  },
};
export default orderService;

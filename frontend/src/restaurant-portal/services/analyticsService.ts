export const analyticsService = {
  getSalesSummary: async (_restaurantId: string): Promise<any> => {
    return Promise.resolve({ totalSales: 0, totalOrders: 0 });
  },
};
export default analyticsService;

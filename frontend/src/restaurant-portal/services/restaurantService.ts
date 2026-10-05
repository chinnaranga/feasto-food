export const restaurantService = {
  getMerchantRestaurants: async (): Promise<any[]> => {
    return Promise.resolve([]);
  },
  updateRestaurantSettings: async (id: string, settings: any): Promise<any> => {
    return Promise.resolve({ id, ...settings });
  },
};
export default restaurantService;

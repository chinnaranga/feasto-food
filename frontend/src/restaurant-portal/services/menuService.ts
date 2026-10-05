export const menuService = {
  getMenuCatalog: async (_restaurantId: string): Promise<any[]> => {
    return Promise.resolve([]);
  },
  updateMenuItemPrice: async (itemId: string, price: number): Promise<any> => {
    return Promise.resolve({ itemId, price });
  },
};
export default menuService;

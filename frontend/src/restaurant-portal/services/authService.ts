export const authService = {
  login: async (email: string, _password?: string): Promise<any> => {
    return new Promise((resolve) => setTimeout(() => resolve({ email }), 500));
  },
  logout: async (): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, 300));
  },
  getCurrentUser: async (): Promise<any> => {
    return Promise.resolve(null);
  },
};
export default authService;

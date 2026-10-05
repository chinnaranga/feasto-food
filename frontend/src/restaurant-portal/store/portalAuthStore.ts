import { create } from 'zustand';
import { MerchantUser } from '../types/portal';

interface PortalAuthState {
  isAuthenticated: boolean;
  isInitializing: boolean;
  user: MerchantUser | null;
  isLoading: boolean;
  error: string | null;

  loginMerchant: (email: string, role: string) => Promise<void>;
  logoutMerchant: () => Promise<void>;
  setInitializing: (val: boolean) => void;
}

export const usePortalAuthStore = create<PortalAuthState>((set) => ({
  isAuthenticated: false, 
  isInitializing: false,
  user: null,
  isLoading: false,
  error: null,

  loginMerchant: async (email, role) => {
    set({ isLoading: true, error: null });
    try {
      // Mock session set
      set({
        isAuthenticated: true,
        user: {
          uid: `mrc-${Math.random().toString(36).substr(2, 9)}`,
          email,
          displayName: email.split('@')[0],
          role: role as any,
          permissions: role === 'Owner' || role === 'Manager' ? ['manage_all'] : ['read_only'],
        },
        isLoading: false,
      });
    } catch (e: any) {
      set({ isLoading: false, error: e.message || 'Authentication failed' });
    }
  },

  logoutMerchant: async () => {
    set({ isLoading: true });
    try {
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    } catch (e) {
      set({ isLoading: false });
    }
  },

  setInitializing: (isInitializing) => set({ isInitializing }),
}));
export default usePortalAuthStore;

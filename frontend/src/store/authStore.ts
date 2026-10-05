import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth as firebaseAuth } from '@/services/firebase';
import { create } from 'zustand';
import { authApi } from '@/services/api/authApi';
import { queryClient } from '@/lib/query/queryClient';
import { socketClient } from '@/services/socket/socketClient';
import { env } from '@/config/env';
import type { AuthUser, LoginRequest, RegisterRequest } from '@/types/api/auth';

interface AuthState {
  isAuthenticated: boolean;
  isInitializing: boolean;
  isLoading: boolean;
  error: string | null;

  user: AuthUser | null;

  token: string | null;
  refreshToken: string | null;
  sessionId: string | null;

  redirectPath: string | null;
  rememberedEmailOrPhone: string | null;

  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  registerUser: (payload: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  initializeSession: () => Promise<void>;

  setTokens: (accessToken: string, refreshToken: string) => void;
  clearSession: () => void;

  login: (token: string, user: AuthUser) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setRedirectPath: (path: string | null) => void;
  setInitializing: (val: boolean) => void;
  setRememberedEmailOrPhone: (val: string | null) => void;
}

const REFRESH_TOKEN_KEY = 'feasto_refresh_token';
const SESSION_ID_KEY = 'feasto_session_id';

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isInitializing: true,
  isLoading: false,
  error: null,

  user: null,
  token: null,
  refreshToken: null,
  sessionId: null,

  redirectPath: null,
  rememberedEmailOrPhone: null,

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authApi.login({ email, password } as LoginRequest);
      localStorage.setItem(REFRESH_TOKEN_KEY, result.tokens.refreshToken);
      localStorage.setItem(SESSION_ID_KEY, result.session.sessionId);

      set({
        isAuthenticated: true,
        user: result.user,
        token: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
        sessionId: result.session.sessionId,
        isLoading: false,
        error: null,
      });

      socketClient.connect(result.tokens.accessToken);
    } catch (err: any) {
      set({ isLoading: false, error: err?.message || 'Sign in failed' });
      throw err;
    }
  },

  signInWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(firebaseAuth, provider);
      const email = result.user.email || '';
      const name = result.user.displayName || email.split('@')[0] || 'User';

      try {
        const authRes = await authApi.login({ email, password: `google-oauth-${result.user.uid}` });
        localStorage.setItem(REFRESH_TOKEN_KEY, authRes.tokens.refreshToken);
        localStorage.setItem(SESSION_ID_KEY, authRes.session.sessionId);

        set({
          isAuthenticated: true,
          user: authRes.user,
          token: authRes.tokens.accessToken,
          refreshToken: authRes.tokens.refreshToken,
          sessionId: authRes.session.sessionId,
          isLoading: false,
          error: null,
        });
        socketClient.connect(authRes.tokens.accessToken);
      } catch {
        try {
          const regRes = await authApi.register({
            name,
            email,
            password: `google-oauth-${result.user.uid}`,
            role: 'customer',
          });
          localStorage.setItem(REFRESH_TOKEN_KEY, regRes.tokens.refreshToken);
          localStorage.setItem(SESSION_ID_KEY, regRes.session.sessionId);

          set({
            isAuthenticated: true,
            user: regRes.user,
            token: regRes.tokens.accessToken,
            refreshToken: regRes.tokens.refreshToken,
            sessionId: regRes.session.sessionId,
            isLoading: false,
            error: null,
          });
          socketClient.connect(regRes.tokens.accessToken);
        } catch {
          const idToken = await result.user.getIdToken();
          set({
            isAuthenticated: true,
            token: idToken,
            user: {
              id: result.user.uid,
              name,
              email,
              phone: result.user.phoneNumber || undefined,
              role: 'customer',
              permissions: [],
              accountStatus: 'active',
              verificationStatus: { emailVerified: true, phoneVerified: false },
              preferredLanguage: 'en',
              createdAt: new Date().toISOString(),
            },
            isLoading: false,
            error: null,
          });
        }
      }
    } catch (err: any) {
      set({ isLoading: false, error: err?.message || 'Google sign in failed' });
      throw err;
    }
  },

  registerUser: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authApi.register(payload);
      localStorage.setItem(REFRESH_TOKEN_KEY, result.tokens.refreshToken);
      localStorage.setItem(SESSION_ID_KEY, result.session.sessionId);

      set({
        isAuthenticated: true,
        user: result.user,
        token: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
        sessionId: result.session.sessionId,
        isLoading: false,
        error: null,
      });
      socketClient.connect(result.tokens.accessToken);
    } catch (err: any) {
      set({ isLoading: false, error: err?.message || 'Registration failed' });
      throw err;
    }
  },

  logout: async () => {
    const { sessionId } = get();
    try {
      await authApi.logout(sessionId || undefined);
    } catch {
      // Ignore if session already dead on server
    }
    get().clearSession();
  },

  initializeSession: async () => {
    set({ isInitializing: true });
    try {
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      const storedSessionId = localStorage.getItem(SESSION_ID_KEY);

      if (!storedRefreshToken) {
        set({ isInitializing: false, isAuthenticated: false });
        return;
      }

      // Refresh session on page reload/navigation
      const res = await fetch(`${env.VITE_API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      if (!res.ok) {
        get().clearSession();
        return;
      }

      const data = await res.json();
      const newAccessToken = data?.data?.tokens?.accessToken;
      const newRefreshToken = data?.data?.tokens?.refreshToken || storedRefreshToken;

      if (newAccessToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
        set({
          token: newAccessToken,
          refreshToken: newRefreshToken,
          sessionId: storedSessionId,
        });

        try {
          const user = await authApi.getCurrentUser();
          set({
            isAuthenticated: true,
            user,
            isInitializing: false,
          });
          socketClient.connect(newAccessToken);
          return;
        } catch {
          // If fetching user profile fails, keep session alive with basic info
          set({
            isAuthenticated: true,
            isInitializing: false,
          });
          return;
        }
      }

      get().clearSession();
    } catch {
      get().clearSession();
    }
  },

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    set({ token: accessToken, refreshToken });
  },

  clearSession: () => {
    socketClient.disconnect();
    queryClient.clear();
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(SESSION_ID_KEY);
    set({
      isAuthenticated: false,
      user: null,
      token: null,
      refreshToken: null,
      sessionId: null,
      isInitializing: false,
      error: null,
    });
  },

  login: (token, user) => {
    set({
      isAuthenticated: true,
      token,
      user: user as unknown as AuthUser,
      isLoading: false,
    });
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setRedirectPath: (redirectPath) => set({ redirectPath }),
  setInitializing: (isInitializing) => set({ isInitializing }),
  setRememberedEmailOrPhone: (rememberedEmailOrPhone) => set({ rememberedEmailOrPhone }),
}));

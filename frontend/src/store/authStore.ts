import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth as firebaseAuth } from '@/services/firebase';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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

let firebaseAuthListenerAttached = false;

const normalizeSafeUser = (rawUser: any): AuthUser => ({
  ...rawUser,
  id: rawUser.id || rawUser._id || rawUser.uid || '',
  uid: rawUser.uid || rawUser.id || rawUser._id || '',
  name: rawUser.name || rawUser.displayName || 'User',
  displayName: rawUser.displayName || rawUser.name || 'User',
  email: rawUser.email || '',
  role: rawUser.role || 'customer',
  permissions: rawUser.permissions || [],
  accountStatus: rawUser.accountStatus || 'active',
  verificationStatus: rawUser.verificationStatus || {
    emailVerified: !!rawUser.emailVerified,
    phoneVerified: !!rawUser.phoneVerified,
  },
  preferredLanguage: rawUser.preferredLanguage || 'en',
  createdAt: rawUser.createdAt || new Date().toISOString(),
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
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

          const safeUser = normalizeSafeUser(result.user);

          set({
            isAuthenticated: true,
            user: safeUser,
            token: result.tokens.accessToken,
            refreshToken: result.tokens.refreshToken,
            sessionId: result.session.sessionId,
            isLoading: false,
            isInitializing: false,
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

            const safeUser = normalizeSafeUser(authRes.user);

            set({
              isAuthenticated: true,
              user: safeUser,
              token: authRes.tokens.accessToken,
              refreshToken: authRes.tokens.refreshToken,
              sessionId: authRes.session.sessionId,
              isLoading: false,
              isInitializing: false,
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

              const safeUser = normalizeSafeUser(regRes.user);

              set({
                isAuthenticated: true,
                user: safeUser,
                token: regRes.tokens.accessToken,
                refreshToken: regRes.tokens.refreshToken,
                sessionId: regRes.session.sessionId,
                isLoading: false,
                isInitializing: false,
                error: null,
              });
              socketClient.connect(regRes.tokens.accessToken);
            } catch {
              const idToken = await result.user.getIdToken();
              const safeUser = normalizeSafeUser({
                id: result.user.uid,
                uid: result.user.uid,
                name,
                displayName: name,
                email,
                phone: result.user.phoneNumber || undefined,
                role: 'customer',
                permissions: [],
                accountStatus: 'active',
                verificationStatus: { emailVerified: true, phoneVerified: false },
                preferredLanguage: 'en',
                createdAt: new Date().toISOString(),
              });

              localStorage.setItem(REFRESH_TOKEN_KEY, idToken);
              localStorage.setItem(SESSION_ID_KEY, `fb-${result.user.uid}`);

              set({
                isAuthenticated: true,
                token: idToken,
                refreshToken: idToken,
                sessionId: `fb-${result.user.uid}`,
                user: safeUser,
                isLoading: false,
                isInitializing: false,
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

          const safeUser = normalizeSafeUser(result.user);

          set({
            isAuthenticated: true,
            user: safeUser,
            token: result.tokens.accessToken,
            refreshToken: result.tokens.refreshToken,
            sessionId: result.session.sessionId,
            isLoading: false,
            isInitializing: false,
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
          if (sessionId && !sessionId.startsWith('fb-')) {
            await authApi.logout(sessionId);
          }
        } catch {
          // Ignore if session already dead on server
        }
        try {
          await firebaseAuth.signOut();
        } catch {
          // Ignore
        }
        get().clearSession();
      },

      initializeSession: async () => {
        const state = get();
        const storedRefreshToken = state.refreshToken || localStorage.getItem(REFRESH_TOKEN_KEY);
        const storedSessionId = state.sessionId || localStorage.getItem(SESSION_ID_KEY);
        const currentToken = state.token;
        const currentUser = state.user;

        // 1. Immediately preserve persisted session on reload so there's zero sign-out flicker
        if (state.isAuthenticated && currentUser && (currentToken || storedRefreshToken)) {
          set({ isInitializing: false });
          if (currentToken) {
            socketClient.connect(currentToken);
          }
        }

        // 2. Attach Firebase Auth listener for Google Auth users
        if (!firebaseAuthListenerAttached) {
          firebaseAuthListenerAttached = true;
          onAuthStateChanged(firebaseAuth, async (fbUser) => {
            const current = get();
            if (fbUser) {
              try {
                const idToken = await fbUser.getIdToken();
                if (!current.isAuthenticated || !current.token || current.sessionId?.startsWith('fb-')) {
                  const safeUser = normalizeSafeUser({
                    id: fbUser.uid,
                    uid: fbUser.uid,
                    name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
                    displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
                    email: fbUser.email || '',
                    phone: fbUser.phoneNumber || undefined,
                    role: 'customer',
                    accountStatus: 'active',
                    verificationStatus: {
                      emailVerified: fbUser.emailVerified,
                      phoneVerified: !!fbUser.phoneNumber,
                    },
                    preferredLanguage: 'en',
                    createdAt: new Date().toISOString(),
                  });

                  set({
                    isAuthenticated: true,
                    user: current.user ? normalizeSafeUser(current.user) : safeUser,
                    token: current.token || idToken,
                    refreshToken: current.refreshToken || idToken,
                    sessionId: current.sessionId || `fb-${fbUser.uid}`,
                    isInitializing: false,
                  });
                  localStorage.setItem(REFRESH_TOKEN_KEY, current.refreshToken || idToken);
                  localStorage.setItem(SESSION_ID_KEY, current.sessionId || `fb-${fbUser.uid}`);
                }
              } catch (e) {
                console.warn('[AUTH] Firebase auth synchronization note:', e);
              }
            }
          });
        }

        if (!storedRefreshToken && !currentToken && !currentUser) {
          set({ isInitializing: false, isAuthenticated: false });
          return;
        }

        // 3. Silent session refresh against backend without abruptly terminating the user
        if (storedRefreshToken && !storedRefreshToken.startsWith('eyJhbGciOiJSUzI1NiIs') && !storedSessionId?.startsWith('fb-')) {
          try {
            const res = await fetch(`${env.VITE_API_BASE_URL}/auth/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken: storedRefreshToken }),
            });

            if (res.ok) {
              const data = await res.json();
              const newAccessToken = data?.data?.tokens?.accessToken;
              const newRefreshToken = data?.data?.tokens?.refreshToken || storedRefreshToken;
              const backendUser = data?.data?.user;

              if (newAccessToken) {
                localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
                if (storedSessionId) localStorage.setItem(SESSION_ID_KEY, storedSessionId);

                const activeUser = backendUser ? normalizeSafeUser(backendUser) : (get().user || currentUser);

                set({
                  isAuthenticated: true,
                  token: newAccessToken,
                  refreshToken: newRefreshToken,
                  sessionId: storedSessionId,
                  user: activeUser,
                  isInitializing: false,
                });
                socketClient.connect(newAccessToken);
                return;
              }
            } else if (res.status === 401 || res.status === 403) {
              // ONLY clear session if server explicitly verified that this refresh token is revoked/invalid
              console.warn('[AUTH] Refresh token revoked or expired by server.');
              get().clearSession();
              return;
            } else {
              // 5xx or server cold starting: Keep current session alive!
              console.warn('[AUTH] Session refresh non-200 response, maintaining active session:', res.status);
            }
          } catch (err) {
            // Network failure or Render cold-start latency: Keep active persisted session
            console.warn('[AUTH] Session refresh delayed (server waking up or offline):', err);
          }
        }

        set({ isInitializing: false });
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
        localStorage.removeItem('feasto_auth_session');
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
        const safeUser = normalizeSafeUser(user);
        set({
          isAuthenticated: true,
          token,
          user: safeUser,
          isLoading: false,
          isInitializing: false,
        });
      },

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setRedirectPath: (redirectPath) => set({ redirectPath }),
      setInitializing: (isInitializing) => set({ isInitializing }),
      setRememberedEmailOrPhone: (rememberedEmailOrPhone) => set({ rememberedEmailOrPhone }),
    }),
    {
      name: 'feasto_auth_session',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        sessionId: state.sessionId,
        rememberedEmailOrPhone: state.rememberedEmailOrPhone,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.isAuthenticated && (state.token || state.refreshToken || state.user)) {
            state.isInitializing = false;
          }
        }
      },
    }
  )
);

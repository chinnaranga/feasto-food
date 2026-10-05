import { env } from '@/config/env';
import { useAuthStore } from '@/store/authStore';
import { normalizeError, AuthenticationError, ApiError } from './errors';
import { normalizeResponse } from './response';

interface RequestOptions extends RequestInit {
  timeoutMs?: number;
  skipAuth?: boolean;
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const storedRefreshToken = useAuthStore.getState().refreshToken;
      if (!storedRefreshToken) {
        useAuthStore.getState().clearSession();
        return null;
      }

      if (import.meta.env.DEV) {
        console.debug('[AUTH] Refreshing session token...');
      }

      const response = await fetch(`${env.VITE_API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      if (!response.ok) {
        useAuthStore.getState().clearSession();
        return null;
      }

      const data = await response.json();
      const newAccessToken = data?.data?.tokens?.accessToken;
      const newRefreshToken = data?.data?.tokens?.refreshToken;
      if (newAccessToken) {
        useAuthStore.getState().setTokens(newAccessToken, newRefreshToken || storedRefreshToken);
        return newAccessToken;
      }
      return null;
    } catch {
      useAuthStore.getState().clearSession();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export const apiClient = {
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { timeoutMs = 20000, skipAuth = false, headers: customHeaders, ...fetchOpts } = options;
    const url = endpoint.startsWith('http') ? endpoint : `${env.VITE_API_BASE_URL}${endpoint}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    let token = useAuthStore.getState().token;
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Request-ID': requestId,
      ...(customHeaders as Record<string, string>),
    };

    if (!skipAuth && token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (import.meta.env.DEV) {
      console.debug(`[API] ${fetchOpts.method || 'GET'} ${url} [${requestId}]`);
    }

    try {
      let response = await fetch(url, {
        ...fetchOpts,
        headers,
        signal: controller.signal,
        credentials: 'include',
      });

      // Handle 401 & Single-flight token refresh
      if (response.status === 401 && !skipAuth && !endpoint.includes('/auth/refresh')) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          headers['Authorization'] = `Bearer ${newToken}`;
          response = await fetch(url, {
            ...fetchOpts,
            headers,
            signal: controller.signal,
          });
        } else {
          throw new AuthenticationError('Session expired. Please log in again.');
        }
      }

      if (!response.ok) {
        let errJson: any = null;
        try {
          errJson = await response.json();
        } catch {
          // Empty body
        }
        throw normalizeError(errJson?.error || errJson, response.status);
      }

      if (response.status === 204) {
        return {} as T;
      }

      const json = await response.json();
      return normalizeResponse<T>(json);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw normalizeError({ message: 'Request execution timed out. Please try again.' }, 408);
      }
      throw normalizeError(err);
    } finally {
      clearTimeout(timer);
    }
  },

  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  patch<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};

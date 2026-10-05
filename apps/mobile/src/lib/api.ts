import { ENV } from '../config/env';
import { AuthStorage } from './storage';

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];
let authExpiredCallback: (() => void) | null = null;

export function registerAuthExpiredHandler(handler: () => void) {
  authExpiredCallback = handler;
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${ENV.API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (!options.skipAuth) {
    const token = await AuthStorage.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized with automatic refresh token rotation
  if (response.status === 401 && !options.skipAuth && !endpoint.includes('/auth')) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshToken = await AuthStorage.getRefreshToken();
        if (!refreshToken) {
          throw new Error('NO_REFRESH_TOKEN');
        }

        const refreshRes = await fetch(`${ENV.API_BASE_URL}/api/mobile/v1/auth/session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (!refreshRes.ok) {
          throw new Error('REFRESH_FAILED');
        }

        const refreshData = await refreshRes.json();
        await AuthStorage.saveTokens({
          accessToken: refreshData.accessToken,
          refreshToken: refreshData.refreshToken || refreshToken,
        });

        isRefreshing = false;
        onRefreshed(refreshData.accessToken);

        // Retry original request with newly acquired access token
        headers['Authorization'] = `Bearer ${refreshData.accessToken}`;
        response = await fetch(url, { ...options, headers });
      } catch (err) {
        isRefreshing = false;
        refreshSubscribers = [];
        await AuthStorage.clearAll();
        if (authExpiredCallback) {
          authExpiredCallback();
        }
        throw new Error('SESSION_EXPIRED');
      }
    } else {
      // Wait for ongoing refresh to complete
      const retryToken = await new Promise<string>((resolve) => {
        refreshSubscribers.push(resolve);
      });
      headers['Authorization'] = `Bearer ${retryToken}`;
      response = await fetch(url, { ...options, headers });
    }
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || `HTTP error ${response.status}`;
    const err = new Error(errorMsg);
    (err as any).status = response.status;
    (err as any).data = data;
    throw err;
  }

  return data as T;
}

export const api = {
  get: <T = any>(endpoint: string, options?: RequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: 'GET' }),
  post: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'POST',
      body:
        typeof FormData !== 'undefined' && body instanceof FormData
          ? body
          : body
          ? JSON.stringify(body)
          : undefined,
    }),
  put: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'PUT',
      body:
        typeof FormData !== 'undefined' && body instanceof FormData
          ? body
          : body
          ? JSON.stringify(body)
          : undefined,
    }),
  delete: <T = any>(endpoint: string, options?: RequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: 'DELETE' }),
};

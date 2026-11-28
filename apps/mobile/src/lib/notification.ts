import { Platform } from 'react-native';
import { apiClient } from './api';
import { AuthStorage } from './storage';

export interface MobileNotificationItem {
  recipientId: string;
  notificationId: string;
  title: string;
  body: string;
  type: string;
  priority: string;
  data?: Record<string, any>;
  createdAt: string;
  isRead: boolean;
  readAt?: string;
  createdBy?: {
    id: string;
    name?: string;
    image?: string;
  };
}

export interface MobileNotificationsResponse {
  success: boolean;
  items: MobileNotificationItem[];
  totalCount: number;
  unreadCount: number;
  page: number;
  totalPages: number;
}

/**
 * Register mobile device token with backend
 */
export async function registerMobileDeviceToken(token: string) {
  if (!token) return;
  try {
    const platform = Platform.OS === 'ios' ? 'IOS' : 'ANDROID';
    await apiClient('/api/mobile/v1/notifications/tokens', {
      method: 'POST',
      body: JSON.stringify({
        token,
        platform,
        deviceInfo: `${Platform.OS} ${Platform.Version}`,
      }),
    });
  } catch (error) {
    console.warn('[Notification] Failed to register device token:', error);
  }
}

/**
 * Unregister device token from backend on logout
 */
export async function unregisterMobileDeviceToken(token: string) {
  if (!token) return;
  try {
    await apiClient('/api/mobile/v1/notifications/tokens', {
      method: 'DELETE',
      body: JSON.stringify({ token }),
    });
  } catch (error) {
    console.warn('[Notification] Failed to unregister device token:', error);
  }
}

/**
 * Fetch notifications list for current logged-in user
 */
export async function fetchMobileNotifications(params?: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}): Promise<MobileNotificationsResponse> {
  const page = params?.page || 1;
  const limit = params?.limit || 20;
  const unreadOnly = params?.unreadOnly || false;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(unreadOnly ? { unreadOnly: 'true' } : {}),
  });

  return await apiClient<MobileNotificationsResponse>(
    `/api/mobile/v1/notifications?${queryParams.toString()}`
  );
}

/**
 * Mark notifications as read
 */
export async function markMobileNotificationsRead(recipientIds: string[]) {
  return await apiClient('/api/mobile/v1/notifications', {
    method: 'PUT',
    body: JSON.stringify({ recipientIds }),
  });
}

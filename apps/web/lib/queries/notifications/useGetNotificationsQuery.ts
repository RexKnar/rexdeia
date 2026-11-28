'use client';

import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';

export interface NotificationItemData {
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

export interface NotificationsResponse {
  items: NotificationItemData[];
  totalCount: number;
  unreadCount: number;
  page: number;
  totalPages: number;
}

export function useGetNotificationsQuery(
  params?: { page?: number; limit?: number; unreadOnly?: boolean },
  options?: Partial<UseQueryOptions<NotificationsResponse>>
) {
  const page = params?.page || 1;
  const limit = params?.limit || 20;
  const unreadOnly = params?.unreadOnly || false;

  return useQuery({
    queryKey: ['notifications', page, limit, unreadOnly],
    queryFn: async (): Promise<NotificationsResponse> => {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(unreadOnly ? { unreadOnly: 'true' } : {}),
      });

      const res = await fetch(`/api/notifications?${searchParams.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to fetch notifications');
      }
      return res.json();
    },
    refetchInterval: 30000, // Poll every 30s as fallback if websockets not active
    ...options,
  });
}

export function useMarkNotificationsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      recipientIds?: string[];
      notificationIds?: string[];
      markAll?: boolean;
    }) => {
      const res = await fetch('/api/notifications/read', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error('Failed to mark notifications as read');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useSendBroadcastMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      title: string;
      body: string;
      targetRole?: string;
      classId?: string;
      sectionId?: string;
      priority?: string;
      data?: Record<string, any>;
    }) => {
      const res = await fetch('/api/notifications/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error?.error || 'Failed to send broadcast');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useGetBroadcastsQuery(
  params?: { page?: number; limit?: number },
  options?: Partial<UseQueryOptions<any>>
) {
  const page = params?.page || 1;
  const limit = params?.limit || 20;

  return useQuery({
    queryKey: ['announcements', page, limit],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      const res = await fetch(`/api/notifications/broadcast?${searchParams.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to fetch announcements');
      }
      return res.json();
    },
    ...options,
  });
}

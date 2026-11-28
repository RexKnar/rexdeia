'use client';

import { useQueryClient } from '@tanstack/react-query';
import { onForegroundMessage, requestWebNotificationPermission } from 'lib/firebase-client';
import {
  NotificationItemData,
  useGetNotificationsQuery,
  useMarkNotificationsReadMutation,
} from 'lib/queries/notifications/useGetNotificationsQuery';
import { Bell, BellDot, CheckCheck, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Button,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from 'ui';
import { cn } from 'utils';

import { NotificationItem } from './NotificationItem';

export function NotificationPopover() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'exams' | 'announcements'>('all');

  const queryClient = useQueryClient();
  const { data, isLoading } = useGetNotificationsQuery();
  const markReadMutation = useMarkNotificationsReadMutation();

  const notifications = data?.items || [];
  const unreadCount = data?.unreadCount || 0;

  // Request browser notification permission once mounted and listen for foreground messages
  useEffect(() => {
    requestWebNotificationPermission().catch(() => {});

    const unsubscribe = onForegroundMessage(() => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [queryClient]);

  const handleMarkAllAsRead = () => {
    if (unreadCount > 0) {
      markReadMutation.mutate({ markAll: true });
    }
  };

  const handleMarkItemRead = (recipientId: string) => {
    markReadMutation.mutate({ recipientIds: [recipientId] });
  };

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === 'unread') return !item.isRead;
    if (activeTab === 'exams') return item.type === 'EXAM_LIVE' || item.type === 'EXAM_UPDATE';
    if (activeTab === 'announcements') return item.type === 'ANNOUNCEMENT';
    return true;
  });

  return (
    <Popover>
      <PopoverTrigger
        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
        className={cn(
          'relative rounded-full p-2 transition-colors hover:bg-gray-100',
          isPopoverOpen && 'bg-gray-200'
        )}
        aria-label="Notifications"
      >
        {unreadCount > 0 ? (
          <>
            <BellDot size={20} className="text-blue-600" />
            <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          </>
        ) : (
          <Bell size={20} className="text-gray-600" />
        )}
      </PopoverTrigger>

      <PopoverContent
        onCloseAutoFocus={() => setIsPopoverOpen(false)}
        className="w-[380px] max-w-[90vw] overflow-hidden rounded-xl border border-gray-200 bg-white p-0 shadow-xl"
        align="end"
      >
        <PopoverArrow className="h-4 w-4 fill-white" />

        <header className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <Text variant="base-semibold" className="text-gray-900">
              Notifications
            </Text>
            {unreadCount > 0 && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                {unreadCount} new
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={markReadMutation.isPending}
              className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
            >
              <CheckCheck size={14} />
              Mark all as read
            </button>
          )}
        </header>

        <section>
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={(val: any) => setActiveTab(val)}
          >
            <TabsList className="grid w-full grid-cols-4 rounded-none border-b border-gray-100 bg-white p-0">
              <TabsTrigger
                value="all"
                className="rounded-none border-b-2 border-transparent py-2 text-xs data-[state=active]:border-blue-600 data-[state=active]:font-semibold data-[state=active]:text-blue-600"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="unread"
                className="rounded-none border-b-2 border-transparent py-2 text-xs data-[state=active]:border-blue-600 data-[state=active]:font-semibold data-[state=active]:text-blue-600"
              >
                Unread
              </TabsTrigger>
              <TabsTrigger
                value="exams"
                className="rounded-none border-b-2 border-transparent py-2 text-xs data-[state=active]:border-blue-600 data-[state=active]:font-semibold data-[state=active]:text-blue-600"
              >
                Exams
              </TabsTrigger>
              <TabsTrigger
                value="announcements"
                className="rounded-none border-b-2 border-transparent py-2 text-xs data-[state=active]:border-blue-600 data-[state=active]:font-semibold data-[state=active]:text-blue-600"
              >
                Updates
              </TabsTrigger>
            </TabsList>

            <div className="max-h-[380px] min-h-[160px] overflow-y-auto">
              {isLoading ? (
                <div className="flex h-36 items-center justify-center text-gray-500">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="flex h-36 flex-col items-center justify-center p-4 text-center">
                  <Bell className="mb-2 h-8 w-8 text-gray-300" />
                  <Text variant="sm-medium" className="text-gray-500">
                    No Notifications
                  </Text>
                  <p className="mt-1 text-xs text-gray-400">
                    {activeTab === 'unread'
                      ? "You're all caught up!"
                      : 'No notifications in this category yet.'}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((item) => (
                  <NotificationItem
                    key={item.recipientId}
                    item={item}
                    onMarkAsRead={handleMarkItemRead}
                  />
                ))
              )}
            </div>
          </Tabs>
        </section>
      </PopoverContent>
    </Popover>
  );
}

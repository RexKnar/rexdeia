'use client';

import { formatDistanceToNow } from 'date-fns';
import { BookOpen, Calendar, Circle, Megaphone } from 'lucide-react';
import Link from 'next/link';
import { Text } from 'ui';
import { cn } from 'utils';

import { NotificationItemData } from '../../queries/notifications/useGetNotificationsQuery';

export function NotificationItem({
  item,
  onMarkAsRead,
}: {
  item: NotificationItemData;
  onMarkAsRead?: (recipientId: string) => void;
}) {
  const timeAgo = item.createdAt
    ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })
    : '';

  const getIcon = () => {
    switch (item.type) {
      case 'EXAM_LIVE':
        return <Calendar className="h-5 w-5 text-blue-600" />;
      case 'EXAM_UPDATE':
        return <BookOpen className="h-5 w-5 text-purple-600" />;
      case 'ANNOUNCEMENT':
        return <Megaphone className="h-5 w-5 text-amber-600" />;
      default:
        return <Megaphone className="h-5 w-5 text-gray-600" />;
    }
  };

  const content = (
    <div
      onClick={() => {
        if (!item.isRead && onMarkAsRead) {
          onMarkAsRead(item.recipientId);
        }
      }}
      className={cn(
        'group flex cursor-pointer items-start gap-3 border-b border-gray-100 p-3 transition-colors hover:bg-gray-50',
        !item.isRead && 'bg-blue-50/40'
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-200">
        {getIcon()}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <Text variant="sm-semibold" className="truncate text-gray-900">
            {item.title}
          </Text>
          {!item.isRead && (
            <Circle className="h-2 w-2 shrink-0 fill-blue-600 text-blue-600" />
          )}
        </div>
        <p className="line-clamp-2 text-xs text-gray-600">{item.body}</p>
        <span className="mt-1 block text-[11px] text-gray-400">{timeAgo}</span>
      </div>
    </div>
  );

  if (item.data?.url) {
    return (
      <Link href={item.data.url} className="block no-underline">
        {content}
      </Link>
    );
  }

  return content;
}

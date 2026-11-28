'use client';

import { useGetBroadcastsQuery } from 'lib/queries/notifications/useGetNotificationsQuery';
import { format } from 'date-fns';
import {
  Bell,
  Calendar,
  CheckCircle2,
  Megaphone,
  Plus,
  Send,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { Button, Text } from 'ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';

import { ComposeAnnouncementModal } from './_components/ComposeAnnouncementModal';

export default function AnnouncementsPage() {
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetBroadcastsQuery({ page, limit: 20 });
  const announcements = data?.items || [];
  const totalCount = data?.totalCount || 0;

  const getAudienceBadge = (role: string) => {
    switch (role) {
      case 'ALL':
        return (
          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            Everyone
          </span>
        );
      case 'STAFF':
      case 'TEACHING_STAFF':
        return (
          <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
            Staff
          </span>
        );
      case 'STUDENT':
        return (
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
            Students
          </span>
        );
      case 'PARENT':
        return (
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
            Parents
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {role}
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'HIGH') {
      return (
        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
          Urgent
        </span>
      );
    }
    return (
      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-normal text-gray-600">
        Normal
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Megaphone className="h-7 w-7 text-blue-600" />
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Communications & Announcements
            </h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Broadcast instant push notifications and in-app updates to staff, students, and parents.
          </p>
        </div>

        <Button
          onClick={() => setIsComposeOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
        >
          <Plus className="h-4 w-4" />
          New Announcement
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Total Announcements
            </span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Megaphone className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{totalCount}</span>
            <span className="text-xs text-gray-400">broadcasts sent</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Delivery Channels
            </span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <Send className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">Mobile + Web</span>
            <span className="text-xs text-gray-400">FCM & In-App</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Target Audiences
            </span>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">Staff, Students, Parents</span>
          </div>
        </div>
      </div>

      {/* Announcements Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">Sent Broadcast History</h2>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center text-gray-400">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
              <span className="text-sm">Loading announcements...</span>
            </div>
          </div>
        ) : announcements.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center p-6 text-center">
            <div className="rounded-full bg-blue-50 p-4 text-blue-600">
              <Bell className="h-8 w-8" />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-gray-900">No Announcements Sent Yet</h3>
            <p className="mt-1 text-xs text-gray-500 max-w-sm">
              Keep your school community informed. Send your first push notification and announcement to staff, students, or parents.
            </p>
            <Button
              onClick={() => setIsComposeOpen(true)}
              className="mt-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4" />
              Compose First Announcement
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/60">
                  <TableHead className="font-semibold text-gray-700">Title & Message</TableHead>
                  <TableHead className="font-semibold text-gray-700">Target Audience</TableHead>
                  <TableHead className="font-semibold text-gray-700">Priority</TableHead>
                  <TableHead className="font-semibold text-gray-700">Recipients</TableHead>
                  <TableHead className="font-semibold text-gray-700">Sent By</TableHead>
                  <TableHead className="font-semibold text-gray-700">Sent At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements.map((item: any) => (
                  <TableRow key={item.id} className="hover:bg-gray-50/50">
                    <TableCell className="max-w-md py-3.5">
                      <div className="font-semibold text-gray-900">{item.title}</div>
                      <div className="line-clamp-2 text-xs text-gray-500 mt-0.5">
                        {item.body}
                      </div>
                    </TableCell>
                    <TableCell className="py-3.5">
                      {getAudienceBadge(item.targetRole)}
                    </TableCell>
                    <TableCell className="py-3.5">
                      {getPriorityBadge(item.priority)}
                    </TableCell>
                    <TableCell className="py-3.5">
                      <span className="inline-flex items-center gap-1 font-medium text-xs text-gray-700">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        {item._count?.recipients ?? 0}
                      </span>
                    </TableCell>
                    <TableCell className="py-3.5 text-xs text-gray-600">
                      {item.createdBy?.name || 'Management'}
                    </TableCell>
                    <TableCell className="py-3.5 text-xs text-gray-500 whitespace-nowrap">
                      {item.createdAt ? format(new Date(item.createdAt), 'dd MMM yyyy, hh:mm a') : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <ComposeAnnouncementModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
      />
    </div>
  );
}

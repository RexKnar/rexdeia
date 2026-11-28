'use client';

import { SearchableSelect } from '@/components/SearchableSelect';
import { useGetClassListQuery } from 'lib/queries/class/useGetClassListQuery';
import { useSendBroadcastMutation } from 'lib/queries/notifications/useGetNotificationsQuery';
import { useGetAllSectionByClassIdQuery } from 'lib/queries/section/useGetAllSectionsByClassIdQuery';
import { Bell, Loader2, Send } from 'lucide-react';
import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Text,
  useToast,
} from 'ui';

const AUDIENCE_OPTIONS = [
  { id: 'ALL', name: 'Everyone (Staff, Students & Parents)' },
  { id: 'STAFF', name: 'All Staff (Teaching & Non-Teaching)' },
  { id: 'TEACHING_STAFF', name: 'Teaching Staff Only' },
  { id: 'STUDENT', name: 'Students Only' },
  { id: 'PARENT', name: 'Parents Only' },
];

const PRIORITY_OPTIONS = [
  { id: 'NORMAL', name: 'Normal Priority' },
  { id: 'HIGH', name: 'High / Urgent Priority' },
];

export function ComposeAnnouncementModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [targetRole, setTargetRole] = useState('ALL');
  const [priority, setPriority] = useState('NORMAL');
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');

  const { data: classList, isLoading: isClassLoading } = useGetClassListQuery({
    page: 1,
    limit: 100,
    filter: { isActive: true },
  });

  const { data: sectionList, isLoading: isSectionLoading } =
    useGetAllSectionByClassIdQuery(
      { classId, filter: { isActive: true } },
      { enabled: Boolean(classId) }
    );

  const broadcastMutation = useSendBroadcastMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please provide both an announcement title and message.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const res = await broadcastMutation.mutateAsync({
        title: title.trim(),
        body: body.trim(),
        targetRole,
        priority,
        classId: classId || undefined,
        sectionId: sectionId || undefined,
      });

      toast({
        title: 'Announcement Sent!',
        description: `Delivered to ${res.recipientCount ?? 0} recipients via Push & In-App notification.`,
      });

      // Reset form & close
      setTitle('');
      setBody('');
      setClassId('');
      setSectionId('');
      setTargetRole('ALL');
      setPriority('NORMAL');
      onClose();
    } catch (err: any) {
      toast({
        title: 'Failed to Send Announcement',
        description: err?.message || 'An error occurred while sending notification.',
        variant: 'destructive',
      });
    }
  };

  const classOptions = [
    { id: '', name: 'All Classes (School-wide)' },
    ...(classList?.data || []).map((c: any) => ({
      id: c.id,
      name: c.name,
    })),
  ];

  const sectionOptions = [
    { id: '', name: 'All Sections' },
    ...(sectionList?.data || []).map((s: any) => ({
      id: s.id,
      name: s.name,
    })),
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl overflow-hidden rounded-2xl bg-white p-6 shadow-2xl">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Send Notification / Announcement
              </DialogTitle>
              <p className="text-xs text-gray-500">
                Dispatches an instant push notification to mobile & web, plus in-app inbox.
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Target Audience <span className="text-red-500">*</span>
            </label>
            <SearchableSelect
              label=""
              value={targetRole}
              onChange={(val) => setTargetRole(val)}
              options={AUDIENCE_OPTIONS}
              placeholder="Select Target Audience"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Class Filter (Optional)
              </label>
              <SearchableSelect
                label=""
                value={classId}
                onChange={(val) => {
                  setClassId(val);
                  setSectionId('');
                }}
                options={classOptions}
                placeholder={isClassLoading ? 'Loading classes...' : 'All Classes'}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Section Filter (Optional)
              </label>
              <SearchableSelect
                label=""
                value={sectionId}
                onChange={(val) => setSectionId(val)}
                options={sectionOptions}
                placeholder={
                  !classId
                    ? 'Select Class first'
                    : isSectionLoading
                    ? 'Loading sections...'
                    : 'All Sections'
                }
                disabled={!classId}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Announcement Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Annual Sports Day Schedule Announced"
              className="w-full"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Message Body <span className="text-red-500">*</span>
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write the announcement details here..."
              rows={4}
              required
              className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Priority
            </label>
            <SearchableSelect
              label=""
              value={priority}
              onChange={(val) => setPriority(val)}
              options={PRIORITY_OPTIONS}
              placeholder="Select Priority"
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={broadcastMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={broadcastMutation.isPending}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {broadcastMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Announcement
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

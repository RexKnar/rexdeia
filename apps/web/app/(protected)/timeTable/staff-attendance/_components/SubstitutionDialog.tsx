'use client';

import { useGetStaffSubstitutionQuery } from 'lib/queries/timetable/useGetStaffSubstitutionQuery';
import { useSaveSubstitutionMutationQuery } from 'lib/queries/timetable/useSaveSubstitutionMutationQuery';
import { Loader2 } from 'lucide-react';
import { toast } from 'ui';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from 'ui/components/ui/Dialog';

type Props = {
  readonly staffId: string;
  readonly staffName: string;
  readonly date: string;
  readonly open: boolean;
  readonly onClose: () => void;
};

export function SubstitutionDialog({
  staffId,
  staffName,
  date,
  open,
  onClose,
}: Props) {
  const { data, isLoading } = useGetStaffSubstitutionQuery(
    { staffId, date },
    { enabled: open && !!staffId }
  );
  const saveMutation = useSaveSubstitutionMutationQuery(staffId);

  const assign = async (entryId: string, substituteStaffId: string) => {
    try {
      await saveMutation.mutateAsync({
        date,
        entryId,
        originalStaffId: staffId,
        substituteStaffId: substituteStaffId || null,
      });
    } catch {
      toast({ title: 'Error saving substitute', variant: 'default' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="flex max-h-[85vh] w-[95vw] max-w-3xl flex-col">
        <DialogHeader>
          <DialogTitle>
            Assign substitutes — {staffName}
            <span className="ml-2 text-sm font-normal text-gray-500">
              {date}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 p-8 text-gray-600">
              <Loader2 className="h-5 w-5 animate-spin text-primary" /> Loading…
            </div>
          ) : !data?.periods.length ? (
            <p className="p-8 text-center text-sm text-gray-600">
              No periods are scheduled for this staff on this day.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-600">
                  <th className="p-3">Period</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Section</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Substitute</th>
                </tr>
              </thead>
              <tbody>
                {data.periods.map((p) => (
                  <tr key={p.entryId} className="border-b">
                    <td className="p-3 font-medium text-gray-800">
                      {p.slotLabel}
                    </td>
                    <td className="whitespace-nowrap p-3 text-gray-600">
                      {p.time}
                    </td>
                    <td className="p-3">{p.sectionName}</td>
                    <td className="p-3">{p.subjectName}</td>
                    <td className="p-3">
                      <select
                        defaultValue={p.substituteStaffId ?? ''}
                        onChange={(e) => assign(p.entryId, e.target.value)}
                        className="w-full rounded-md border px-2 py-1.5 text-sm"
                      >
                        <option value="">— None —</option>
                        {data.candidates.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

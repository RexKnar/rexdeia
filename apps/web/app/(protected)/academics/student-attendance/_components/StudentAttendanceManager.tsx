'use client';

import {
  AttendanceStatus,
  StudentAttendanceScope,
} from 'lib/domain/timetable';
import { useGetClassListQuery } from 'lib/queries/class/useGetClassListQuery';
import { useGetAllSectionByClassIdQuery } from 'lib/queries/section/useGetAllSectionsByClassIdQuery';
import { useGetStudentAttendanceQuery } from 'lib/queries/timetable/useGetStudentAttendanceQuery';
import { useSaveStudentAttendanceMutationQuery } from 'lib/queries/timetable/useSaveStudentAttendanceMutationQuery';
import { CalendarDays, Loader2, Save } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Input, toast } from 'ui';

import { SearchableSelect } from '@/components/SearchableSelect';

const STATUSES: AttendanceStatus[] = ['Present', 'Absent', 'Leave'];

const SCOPES: { value: StudentAttendanceScope; label: string }[] = [
  { value: 'daily', label: 'Full Day' },
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'period', label: 'Specific Period' },
];

function localToday() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

export function StudentAttendanceManager() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const classId = searchParams.get('classId') ?? '';
  const sectionId = searchParams.get('sectionId') ?? '';
  const date = searchParams.get('date') || localToday();

  const [scope, setScope] = useState<StudentAttendanceScope>('daily');
  const [slotId, setSlotId] = useState('');
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>({});

  const { data: classList } = useGetClassListQuery({
    page: 1,
    limit: 999,
    filter: {},
  });
  const { data: sectionList } = useGetAllSectionByClassIdQuery(
    { filter: {}, classId },
    { enabled: !!classId }
  );

  const queryEnabled =
    !!sectionId && !!date && (scope !== 'period' || !!slotId);
  const { data, isFetching } = useGetStudentAttendanceQuery(
    { sectionId, date, scope, slotId: scope === 'period' ? slotId : undefined },
    { enabled: queryEnabled }
  );
  const saveMutation = useSaveStudentAttendanceMutationQuery();

  // Default unmarked students to Present so the common "everyone present" case
  // is one click away.
  useEffect(() => {
    if (!data) return;
    const next: Record<string, AttendanceStatus> = {};
    data.students.forEach((s) => {
      next[s.studentId] = s.status ?? 'Present';
    });
    setStatuses(next);
  }, [data]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    if (key === 'classId') params.delete('sectionId');
    router.replace(`${pathname}?${params.toString()}`);
  };

  const setAll = (status: AttendanceStatus) =>
    setStatuses((prev) => {
      const next = { ...prev };
      (data?.students ?? []).forEach((s) => (next[s.studentId] = status));
      return next;
    });

  const handleSave = async () => {
    if (!data?.students.length) return;
    try {
      await saveMutation.mutateAsync({
        sectionId,
        date,
        scope,
        slotId: scope === 'period' ? slotId : null,
        statuses: data.students.map((s) => ({
          studentId: s.studentId,
          status: statuses[s.studentId] ?? 'Present',
        })),
      });
      toast({ title: 'Attendance saved', variant: 'default' });
    } catch {
      toast({ title: 'Error saving attendance', variant: 'default' });
    }
  };

  const summary = (data?.students ?? []).reduce(
    (acc, s) => {
      const st = statuses[s.studentId] ?? 'Present';
      acc[st] += 1;
      return acc;
    },
    { Present: 0, Absent: 0, Leave: 0 } as Record<AttendanceStatus, number>
  );

  return (
    <div className="flex flex-col gap-4">
      <section className="grid grid-cols-1 gap-4 rounded-md border bg-white p-4 shadow-sm md:grid-cols-3">
        <SearchableSelect
          label="Class"
          value={classId}
          onChange={(v) => updateParam('classId', v)}
          options={classList?.data ?? []}
          placeholder="Select class"
        />
        <SearchableSelect
          label="Section"
          value={sectionId}
          onChange={(v) => updateParam('sectionId', v)}
          options={sectionList?.data ?? []}
          placeholder="Select section"
          disabled={!classId}
        />
        <div className="space-y-2">
          <label className="flex items-center gap-1 text-sm font-semibold text-gray-700">
            <CalendarDays size={14} /> Date
          </label>
          <Input
            type="date"
            value={date}
            onChange={(e) => updateParam('date', e.target.value)}
          />
        </div>
      </section>

      {sectionId && (
        <section className="flex flex-wrap items-end gap-3 rounded-md border bg-white p-4 shadow-sm">
          <div className="flex flex-wrap gap-1">
            {SCOPES.map((s) => (
              <button
                key={s.value}
                onClick={() => setScope(s.value)}
                className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                  scope === s.value
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          {scope === 'period' && (
            <select
              value={slotId}
              onChange={(e) => setSlotId(e.target.value)}
              className="rounded-md border px-2 py-1.5 text-sm"
            >
              <option value="">— Select period —</option>
              {(data?.slots ?? []).map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.label} ({slot.startTime}–{slot.endTime})
                </option>
              ))}
            </select>
          )}
        </section>
      )}

      {!sectionId ? (
        <Placeholder text="Select a class, section and date to mark attendance." />
      ) : scope === 'period' && !slotId ? (
        <Placeholder text="Select a specific period to mark its attendance." />
      ) : isFetching && !data ? (
        <LoadingState />
      ) : data?.structureMissing && scope !== 'daily' ? (
        <Placeholder text="No timetable structure for this class level — period/session attendance needs one. You can still mark Full Day attendance." />
      ) : !data?.students.length ? (
        <Placeholder text="No active students found in this section." />
      ) : (
        <>
          <section className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2 text-sm">
              <span className="rounded-full bg-green-100 px-3 py-1 text-green-800">
                Present {summary.Present}
              </span>
              <span className="rounded-full bg-red-100 px-3 py-1 text-red-800">
                Absent {summary.Absent}
              </span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">
                Leave {summary.Leave}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="mild"
                className="h-auto px-3 py-1.5 text-xs"
                onClick={() => setAll('Present')}
              >
                All Present
              </Button>
              <Button
                variant="mild"
                className="h-auto px-3 py-1.5 text-xs"
                onClick={() => setAll('Absent')}
              >
                All Absent
              </Button>
            </div>
          </section>

          <section className="overflow-x-auto rounded-md border bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-600">
                  <th className="p-3">Roll</th>
                  <th className="p-3">Student</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.students.map((s) => (
                  <tr key={s.studentId} className="border-b">
                    <td className="p-3 text-gray-500">{s.rollNumber ?? '-'}</td>
                    <td className="p-3 font-medium text-gray-800">{s.name}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        {STATUSES.map((status) => {
                          const active =
                            (statuses[s.studentId] ?? 'Present') === status;
                          return (
                            <button
                              key={status}
                              onClick={() =>
                                setStatuses((prev) => ({
                                  ...prev,
                                  [s.studentId]: status,
                                }))
                              }
                              className={`rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
                                active
                                  ? status === 'Present'
                                    ? 'border-green-500 bg-green-100 text-green-800'
                                    : status === 'Absent'
                                      ? 'border-red-500 bg-red-100 text-red-800'
                                      : 'border-amber-500 bg-amber-100 text-amber-800'
                                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {status[0]}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="flex justify-end">
            <Button
              variant="default"
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="gap-1"
            >
              {saveMutation.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Save Attendance
            </Button>
          </section>
        </>
      )}
    </div>
  );
}

function Placeholder({ text }: { text: string }) {
  return (
    <section className="rounded-md border border-dashed bg-gray-50 p-8 text-center text-sm text-gray-600">
      {text}
    </section>
  );
}

function LoadingState() {
  return (
    <section className="flex items-center justify-center gap-2 rounded-md bg-white p-8 text-gray-600 shadow-sm">
      <Loader2 className="h-5 w-5 animate-spin text-primary" /> Loading…
    </section>
  );
}

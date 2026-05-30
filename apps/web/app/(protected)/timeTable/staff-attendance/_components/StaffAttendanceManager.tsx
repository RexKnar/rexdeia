'use client';

import { AttendanceStatus } from 'lib/domain/timetable';
import { useGetStaffAttendanceQuery } from 'lib/queries/timetable/useGetStaffAttendanceQuery';
import { useMarkStaffAttendanceMutationQuery } from 'lib/queries/timetable/useMarkStaffAttendanceMutationQuery';
import { CalendarDays, Loader2, UserCog } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Button, Input, toast } from 'ui';

import { SubstitutionDialog } from './SubstitutionDialog';

const STATUSES: AttendanceStatus[] = ['Present', 'Absent', 'Leave'];

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function StaffAttendanceManager() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const date = searchParams.get('date') || todayStr();

  const [search, setSearch] = useState('');
  const [subStaff, setSubStaff] = useState<{ id: string; name: string } | null>(
    null
  );

  const { data, isFetching } = useGetStaffAttendanceQuery({ date });
  const markMutation = useMarkStaffAttendanceMutationQuery();

  const setDate = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set('date', value);
    else params.delete('date');
    router.replace(`${pathname}?${params.toString()}`);
  };

  const mark = async (staffId: string, status: AttendanceStatus) => {
    try {
      await markMutation.mutateAsync({ staffId, date, status });
    } catch {
      toast({ title: 'Error marking attendance', variant: 'default' });
    }
  };

  const filteredStaff = useMemo(() => {
    const list = data?.staff ?? [];
    const q = search.trim().toLowerCase();
    return q ? list.filter((s) => s.name.toLowerCase().includes(q)) : list;
  }, [data, search]);

  const absentCount = (data?.staff ?? []).filter(
    (s) => s.status === 'Absent' || s.status === 'Leave'
  ).length;

  return (
    <div className="flex flex-col gap-4">
      <section className="flex flex-wrap items-end justify-between gap-4 rounded-md border bg-white p-4 shadow-sm">
        <div className="space-y-2">
          <label className="flex items-center gap-1 text-sm font-semibold text-gray-700">
            <CalendarDays size={14} /> Date
          </label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-48"
          />
          {data?.dayName && (
            <p className="text-xs text-gray-500">
              {data.dayName}
              {!data.dayId && ' · no matching working day configured'}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search staff…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56"
          />
          <span className="text-sm text-gray-600">
            {absentCount} absent / on leave
          </span>
        </div>
      </section>

      <section className="overflow-x-auto rounded-md border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-600">
              <th className="p-3">Staff</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Substitution</th>
            </tr>
          </thead>
          <tbody>
            {isFetching && !data ? (
              <tr>
                <td colSpan={3} className="p-8 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-primary" />
                </td>
              </tr>
            ) : filteredStaff.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">
                  No staff found.
                </td>
              </tr>
            ) : (
              filteredStaff.map((staff) => {
                const needsSub =
                  staff.status === 'Absent' || staff.status === 'Leave';
                return (
                  <tr key={staff.id} className="border-b">
                    <td className="p-3 font-medium text-gray-800">
                      {staff.name}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        {STATUSES.map((status) => {
                          const active = staff.status === status;
                          return (
                            <button
                              key={status}
                              onClick={() => mark(staff.id, status)}
                              className={`rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
                                active
                                  ? status === 'Present'
                                    ? 'border-green-500 bg-green-100 text-green-800'
                                    : status === 'Absent'
                                      ? 'border-red-500 bg-red-100 text-red-800'
                                      : 'border-amber-500 bg-amber-100 text-amber-800'
                                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {status}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      {needsSub && (
                        <Button
                          variant="mild"
                          className="h-auto gap-1 px-3 py-1.5 text-xs"
                          onClick={() =>
                            setSubStaff({ id: staff.id, name: staff.name })
                          }
                        >
                          <UserCog size={14} /> Assign substitutes
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>

      {subStaff && (
        <SubstitutionDialog
          staffId={subStaff.id}
          staffName={subStaff.name}
          date={date}
          open={!!subStaff}
          onClose={() => setSubStaff(null)}
        />
      )}
    </div>
  );
}

'use client';

import { useGetClassListQuery } from 'lib/queries/class/useGetClassListQuery';
import { useGetAllSectionByClassIdQuery } from 'lib/queries/section/useGetAllSectionsByClassIdQuery';
import { useGetAttendanceReportQuery } from 'lib/queries/timetable/useGetAttendanceReportQuery';
import { FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'ui';

import { SearchableSelect } from '@/components/SearchableSelect';

import {
  exportAttendanceExcel,
  exportAttendancePdf,
} from './attendanceReportExport';

function monthStart() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1, 12)
    .toISOString()
    .slice(0, 10);
}
function localToday() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

function pctClass(p: number) {
  if (p >= 75) return 'text-green-700';
  if (p >= 50) return 'text-amber-700';
  return 'text-red-700';
}

export function AttendanceReport() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const classId = searchParams.get('classId') ?? '';
  const sectionId = searchParams.get('sectionId') ?? '';
  const from = searchParams.get('from') || monthStart();
  const to = searchParams.get('to') || localToday();

  const { data: classList } = useGetClassListQuery({
    page: 1,
    limit: 999,
    filter: {},
  });
  const { data: sectionList } = useGetAllSectionByClassIdQuery(
    { filter: {}, classId },
    { enabled: !!classId }
  );
  const { data, isFetching } = useGetAttendanceReportQuery(
    { sectionId, from, to },
    { enabled: !!sectionId && !!from && !!to }
  );

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    if (key === 'classId') params.delete('sectionId');
    router.replace(`${pathname}?${params.toString()}`);
  };

  const sectionName =
    sectionList?.data?.find((s: { id: string }) => s.id === sectionId)?.name ??
    'Section';
  const title = `Attendance ${sectionName} ${from} to ${to}`;
  const rows = data?.rows ?? [];

  return (
    <div className="flex flex-col gap-4">
      <section className="grid grid-cols-1 gap-4 rounded-md border bg-white p-4 shadow-sm md:grid-cols-4">
        <SearchableSelect
          label="Class"
          value={classId}
          onChange={(v) => update('classId', v)}
          options={classList?.data ?? []}
          placeholder="Select class"
        />
        <SearchableSelect
          label="Section"
          value={sectionId}
          onChange={(v) => update('sectionId', v)}
          options={sectionList?.data ?? []}
          placeholder="Select section"
          disabled={!classId}
        />
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            From
          </label>
          <input
            type="date"
            value={from}
            onChange={(e) => update('from', e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => update('to', e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
      </section>

      {!sectionId ? (
        <section className="rounded-md border border-dashed bg-gray-50 p-8 text-center text-sm text-gray-600">
          Select a class and section to view the attendance report.
        </section>
      ) : isFetching && !data ? (
        <section className="flex items-center justify-center gap-2 rounded-md bg-white p-8 text-gray-600 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-primary" /> Loading…
        </section>
      ) : (
        <>
          <section className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-600">
              {rows.length} students · {from} → {to}
            </p>
            <div className="flex gap-2">
              <Button
                variant="mild"
                className="h-auto gap-2 px-3 py-2 text-sm"
                disabled={rows.length === 0}
                onClick={() => exportAttendanceExcel(rows, title)}
              >
                <FileSpreadsheet size={16} className="text-green-700" /> Excel
              </Button>
              <Button
                variant="mild"
                className="h-auto gap-2 px-3 py-2 text-sm"
                disabled={rows.length === 0}
                onClick={() => exportAttendancePdf(rows, title)}
              >
                <FileText size={16} className="text-red-600" /> PDF
              </Button>
            </div>
          </section>

          <section className="overflow-x-auto rounded-md border bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-600">
                  <th className="p-3">Roll</th>
                  <th className="p-3">Student</th>
                  <th className="p-3 text-center">Present</th>
                  <th className="p-3 text-center">Absent</th>
                  <th className="p-3 text-center">Leave</th>
                  <th className="p-3 text-center">Total</th>
                  <th className="p-3 text-center">%</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      No attendance records in this range.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.studentId} className="border-b">
                      <td className="p-3 text-gray-500">{r.rollNumber ?? '-'}</td>
                      <td className="p-3 font-medium text-gray-800">{r.name}</td>
                      <td className="p-3 text-center text-green-700">
                        {r.present}
                      </td>
                      <td className="p-3 text-center text-red-700">{r.absent}</td>
                      <td className="p-3 text-center text-amber-700">
                        {r.leave}
                      </td>
                      <td className="p-3 text-center text-gray-700">{r.total}</td>
                      <td
                        className={`p-3 text-center font-semibold ${pctClass(r.percentage)}`}
                      >
                        {r.percentage}%
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
}

'use client';

import { GraduationCap, Loader2, Percent, UserX, XCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { StatCard } from '@/components/dashboard/StatCard';

import { useBranchExamsQuery } from '../../../../../lib/queries/dashboard/useBranchExamsQuery';
import { useExamBranchAnalyticsQuery } from '../../../../../lib/queries/dashboard/useExamBranchAnalyticsQuery';

function staffName(staff: {
  firstName?: string;
  middleName?: string;
  lastName?: string;
}): string {
  return [staff.firstName, staff.middleName, staff.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();
}

type StaffWiseRow = {
  staff: string;
  subject: string;
  section: string;
  totalStudents: number;
  pass: number;
  fail: number;
  absent: number;
  passPercentage: number;
};

function flattenStaffWise(staffWise: any[]): StaffWiseRow[] {
  const rows: StaffWiseRow[] = [];
  (staffWise ?? []).forEach((staff) => {
    (staff.analytics ?? []).forEach((item: any) => {
      rows.push({
        staff: staffName(staff),
        subject: item.subject?.name ?? '—',
        section: [item.section?.class?.name, item.section?.name]
          .filter(Boolean)
          .join(' - '),
        totalStudents: item.totalStudents?.overall ?? 0,
        pass: item.numberOfPassStudents?.overall ?? 0,
        fail: item.numberOfFailStudents?.overall ?? 0,
        absent: item.absent?.overall ?? 0,
        passPercentage: item.passPercentage?.overall ?? 0,
      });
    });
  });
  return rows;
}

export function ExamAnalyticsClient() {
  const examsQuery = useBranchExamsQuery();
  const [examId, setExamId] = useState<string | undefined>();

  // Default to the ongoing exam, else the most recent completed, else first.
  useEffect(() => {
    if (examId || !examsQuery.data?.length) return;
    const ongoing = examsQuery.data.find((e) => e.status === 'ongoing');
    const completed = examsQuery.data.find((e) => e.status === 'completed');
    setExamId((ongoing ?? completed ?? examsQuery.data[0]).id);
  }, [examsQuery.data, examId]);

  const analyticsQuery = useExamBranchAnalyticsQuery({ examId });
  const summary = analyticsQuery.data?.summary;
  const rows = useMemo(
    () => flattenStaffWise(analyticsQuery.data?.staffWise ?? []),
    [analyticsQuery.data]
  );

  return (
    <section className="space-y-6">
      {/* Exam switcher */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Exam</label>
        <select
          value={examId ?? ''}
          onChange={(e) => setExamId(e.target.value)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {!examsQuery.data?.length && <option value="">No exams</option>}
          {examsQuery.data?.map((exam) => (
            <option key={exam.id} value={exam.id}>
              {exam.name} ({exam.status})
            </option>
          ))}
        </select>
        {(examsQuery.isLoading || analyticsQuery.isFetching) && (
          <Loader2 size={16} className="animate-spin text-primary" />
        )}
      </div>

      {/* Header KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Overall Pass %"
          value={summary ? `${summary.passPercentage.toFixed(1)}%` : '—'}
          icon={Percent}
          accent="bg-green-100 text-green-700"
        />
        <StatCard
          label="Failures"
          value={summary?.failCount ?? '—'}
          icon={XCircle}
          accent="bg-red-100 text-red-700"
        />
        <StatCard
          label="Absentees"
          value={summary?.absentCount ?? '—'}
          icon={UserX}
          accent="bg-amber-100 text-amber-700"
        />
        <StatCard
          label="Students"
          value={summary?.totalStudents ?? '—'}
          icon={GraduationCap}
          accent="bg-indigo-100 text-indigo-700"
        />
      </div>

      {/* Staff-wise table */}
      <div className="rounded-md border bg-white shadow-sm">
        <p className="border-b p-4 text-sm font-semibold text-gray-800">
          Staff-wise Pass Percentage
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Staff</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Class / Section</th>
                <th className="px-4 py-3 text-right">Students</th>
                <th className="px-4 py-3 text-right">Pass</th>
                <th className="px-4 py-3 text-right">Fail</th>
                <th className="px-4 py-3 text-right">Absent</th>
                <th className="px-4 py-3 text-right">Pass %</th>
              </tr>
            </thead>
            <tbody>
              {analyticsQuery.isLoading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    <Loader2 className="mx-auto animate-spin text-primary" />
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    No staff analytics available for this exam.
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {row.staff}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{row.subject}</td>
                    <td className="px-4 py-3 text-gray-700">{row.section}</td>
                    <td className="px-4 py-3 text-right">
                      {row.totalStudents}
                    </td>
                    <td className="px-4 py-3 text-right text-green-700">
                      {row.pass}
                    </td>
                    <td className="px-4 py-3 text-right text-red-700">
                      {row.fail}
                    </td>
                    <td className="px-4 py-3 text-right text-amber-700">
                      {row.absent}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {row.passPercentage.toFixed(1)}%
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

'use client';

import {
  BarChart3,
  CalendarClock,
  CircleDashed,
  ClipboardList,
  Clock,
  GraduationCap,
  Loader2,
  Percent,
  Users,
  UserX,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from 'utils';

import { StatCard } from '@/components/dashboard/StatCard';
import { LinkButton } from '@/components/LinkButton';

import {
  AttendanceCounts,
  ExamSummary,
} from '../../../../../lib/queries/dashboard/types';
import { useAdminAttendanceOverviewQuery } from '../../../../../lib/queries/dashboard/useAdminAttendanceOverviewQuery';
import { useAdminDashboardSummaryQuery } from '../../../../../lib/queries/dashboard/useAdminDashboardSummaryQuery';

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function ExamSummaryCard({
  title,
  exam,
}: {
  title: string;
  exam: ExamSummary | null;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-md border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        {exam && (
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {exam.name}
          </span>
        )}
      </div>

      {exam ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="Pass %"
            value={`${exam.passPercentage.toFixed(1)}%`}
            icon={Percent}
            accent="bg-green-100 text-green-700"
          />
          <StatCard
            label="Failures"
            value={exam.failCount}
            icon={XCircle}
            accent="bg-red-100 text-red-700"
          />
          <StatCard
            label="Absentees"
            value={exam.absentCount}
            icon={UserX}
            accent="bg-amber-100 text-amber-700"
          />
          <StatCard
            label="Students"
            value={exam.totalStudents}
            icon={GraduationCap}
            accent="bg-indigo-100 text-indigo-700"
          />
        </div>
      ) : (
        <p className="py-6 text-center text-sm text-gray-500">
          No exam in this window for the current academic year.
        </p>
      )}
    </div>
  );
}

function AttendancePanel({
  heading,
  note,
  counts,
}: {
  heading: string;
  note?: string;
  counts: AttendanceCounts;
}) {
  const tiles = [
    {
      label: 'Present',
      value: counts.present,
      accent: 'bg-green-100 text-green-700',
      icon: GraduationCap,
    },
    {
      label: 'Absent',
      value: counts.absent,
      accent: 'bg-red-100 text-red-700',
      icon: XCircle,
    },
    {
      label: 'Leave',
      value: counts.leave,
      accent: 'bg-amber-100 text-amber-700',
      icon: Clock,
    },
    {
      label: 'Not marked',
      value: counts.notMarked,
      accent: 'bg-gray-100 text-gray-600',
      icon: CircleDashed,
    },
  ];
  return (
    <div className="flex flex-col gap-3 rounded-md border bg-white p-5 shadow-sm">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-semibold text-gray-800">{heading}</p>
        <span className="text-xs text-gray-500">
          {note ? `${note} · ` : ''}Total {counts.total}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((t) => (
          <StatCard
            key={t.label}
            label={t.label}
            value={t.value}
            icon={t.icon}
            accent={t.accent}
          />
        ))}
      </div>
    </div>
  );
}

export function AdminDashboardClient() {
  const [session, setSession] = useState<'morning' | 'afternoon'>('morning');
  const date = todayStr();

  const summaryQuery = useAdminDashboardSummaryQuery();
  const attendanceQuery = useAdminAttendanceOverviewQuery({ date, session });

  const summary = summaryQuery.data;

  return (
    <section className="space-y-8">
      {/* Counts + quick links */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Students"
          value={summary?.totalStudents ?? '—'}
          icon={GraduationCap}
          accent="bg-indigo-100 text-indigo-700"
        />
        <StatCard
          label="Total Staff"
          value={summary?.totalStaff ?? '—'}
          icon={Users}
          accent="bg-blue-100 text-blue-700"
        />
        <div className="flex flex-col justify-between gap-3 rounded-md border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <BarChart3 size={18} className="text-primary" />
            Exam Analytics
          </div>
          <LinkButton url="/admin/exam-analytics" variant="primary" size="sm">
            View full analytics
          </LinkButton>
        </div>
        <div className="flex flex-col justify-between gap-3 rounded-md border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <ClipboardList size={18} className="text-primary" />
            Attendance Report
          </div>
          <LinkButton
            url="/timeTable/attendance-report"
            variant="outline"
            size="sm"
          >
            Open report
          </LinkButton>
        </div>
      </div>

      {/* Exam summary */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CalendarClock size={18} className="text-gray-700" />
          <p className="text-lg font-semibold text-gray-900">Exam Overview</p>
          {summaryQuery.isLoading && (
            <Loader2 size={16} className="animate-spin text-primary" />
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ExamSummaryCard
            title="Ongoing Exam"
            exam={summary?.ongoingExam ?? null}
          />
          <ExamSummaryCard
            title="Last Completed Exam"
            exam={summary?.lastCompletedExam ?? null}
          />
        </div>
      </div>

      {/* Today's attendance */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold text-gray-900">
              Today&apos;s Attendance
            </p>
            {attendanceQuery.isLoading && (
              <Loader2 size={16} className="animate-spin text-primary" />
            )}
          </div>
          <div className="inline-flex rounded-md border bg-white p-0.5">
            {(['morning', 'afternoon'] as const).map((value) => (
              <button
                key={value}
                onClick={() => setSession(value)}
                className={cn(
                  'rounded px-3 py-1.5 text-sm capitalize transition-colors',
                  session === value
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <AttendancePanel
            heading="Students"
            note={session === 'morning' ? 'Morning' : 'Afternoon'}
            counts={
              attendanceQuery.data?.students ?? {
                present: 0,
                absent: 0,
                leave: 0,
                notMarked: 0,
                total: 0,
              }
            }
          />
          <AttendancePanel
            heading="Staff"
            note="Daily"
            counts={
              attendanceQuery.data?.staff ?? {
                present: 0,
                absent: 0,
                leave: 0,
                notMarked: 0,
                total: 0,
              }
            }
          />
        </div>
      </div>
    </section>
  );
}

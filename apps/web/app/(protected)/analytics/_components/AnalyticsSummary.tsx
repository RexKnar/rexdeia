'use client';

import { useExamAnalyticsQuery } from 'lib/queries/analytics/exam/useGetExamAnalyticsQuery';
import {
  ArrowDown10,
  ArrowUp10,
  GraduationCap,
  Loader2,
  Sigma,
  UserCheck,
  UserX,
  Users,
} from 'lucide-react';
import { PieChartWithCustomLabel } from 'lib/Charts/Pie/PieChartWithCustomLabel';

import { AnalyticsBarChart } from './charts/AnalyticsBarChart';
import { AnalyticsKpiCard } from './AnalyticsKpiCard';

type AnalyticsSummaryProps = {
  readonly classId: string | null;
  readonly sectionId: string | null;
  readonly examId: string;
};

const BOYS_COLOR = '#3b82f6';
const GIRLS_COLOR = '#ec4899';

function studentName(student?: {
  firstName?: string;
  middleName?: string;
  lastName?: string;
}) {
  if (!student) return '-';
  return [student.firstName, student.middleName, student.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-md border bg-white p-4 shadow-sm">
      <p className="mb-3 text-sm font-semibold text-gray-800">{title}</p>
      <div className="h-72 w-full">{children}</div>
    </div>
  );
}

export function AnalyticsSummary({
  classId,
  sectionId,
  examId,
}: AnalyticsSummaryProps) {
  const { data, isLoading } = useExamAnalyticsQuery(
    sectionId
      ? { classId: classId ?? undefined, sectionId, examId }
      : { classId: classId ?? undefined, examId },
    { enabled: !!classId && !!examId }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-md bg-white p-10 text-gray-700 shadow-sm">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        Fetching analytics...
      </div>
    );
  }

  if (!data?.analytics) return null;

  const { analytics, subjectWiseCount, markList } = data;

  const total = (analytics.totalPassCount || 0) + (analytics.totalFailCount || 0);

  const average =
    Array.isArray(markList) && markList.length > 0
      ? Math.round(
          markList.reduce((sum, s) => sum + (s.totalMark || 0), 0) /
            markList.length
        )
      : 0;

  const genderBarData = [
    {
      name: 'Pass',
      Boys: analytics.malePassCount || 0,
      Girls: analytics.femalePassCount || 0,
    },
    {
      name: 'Fail',
      Boys: analytics.maleFailCount || 0,
      Girls: analytics.femaleFailCount || 0,
    },
    {
      name: 'Absent',
      Boys: analytics.maleAbsentCount || 0,
      Girls: analytics.femaleAbsentCount || 0,
    },
  ];

  const passFailPie = [
    { name: 'Pass', value: analytics.totalPassCount || 0, colorCode: '#22c55e' },
    { name: 'Fail', value: analytics.totalFailCount || 0, colorCode: '#ef4444' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <AnalyticsKpiCard
          label="Total Students"
          value={total}
          icon={Users}
          accent="bg-indigo-100 text-indigo-700"
        />
        <AnalyticsKpiCard
          label="Passed"
          value={analytics.totalPassCount || 0}
          icon={UserCheck}
          accent="bg-green-100 text-green-700"
          hint={`${analytics.totalPassPercentage || 0}% of students`}
          male={analytics.malePassCount || 0}
          female={analytics.femalePassCount || 0}
        />
        <AnalyticsKpiCard
          label="Failed"
          value={analytics.totalFailCount || 0}
          icon={UserX}
          accent="bg-red-100 text-red-700"
          hint={`${analytics.totalFailPercentage || 0}% of students`}
          male={analytics.maleFailCount || 0}
          female={analytics.femaleFailCount || 0}
        />
        <AnalyticsKpiCard
          label="Absent"
          value={analytics.totalAbsentCount || 0}
          icon={Users}
          accent="bg-amber-100 text-amber-700"
          male={analytics.maleAbsentCount || 0}
          female={analytics.femaleAbsentCount || 0}
        />
        <AnalyticsKpiCard
          label="Average Mark"
          value={average}
          icon={Sigma}
          accent="bg-sky-100 text-sky-700"
          hint="Across all students"
        />
        <AnalyticsKpiCard
          label="Highest Mark"
          value={analytics.highestTotalMark || 0}
          icon={ArrowUp10}
          accent="bg-emerald-100 text-emerald-700"
          hint={studentName(analytics.highestStudent)}
        />
        <AnalyticsKpiCard
          label="Lowest Mark"
          value={analytics.lowestTotalMark || 0}
          icon={ArrowDown10}
          accent="bg-rose-100 text-rose-700"
          hint={studentName(analytics.lowestStudent)}
        />
        <AnalyticsKpiCard
          label="Pass Percentage"
          value={Number(analytics.totalPassPercentage) || 0}
          suffix="%"
          icon={GraduationCap}
          accent="bg-teal-100 text-teal-700"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Pass / Fail / Absent by Gender">
          <AnalyticsBarChart
            data={genderBarData}
            bars={[
              { key: 'Boys', name: 'Boys', color: BOYS_COLOR },
              { key: 'Girls', name: 'Girls', color: GIRLS_COLOR },
            ]}
            height={288}
          />
        </ChartCard>
        <ChartCard title="Pass vs Fail Distribution">
          <PieChartWithCustomLabel pieData={passFailPie} colorCodeIndex={5} />
        </ChartCard>
      </div>

      {Array.isArray(subjectWiseCount) && subjectWiseCount.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Students by Subjects Passed">
            <AnalyticsBarChart
              data={subjectWiseCount}
              xKey="subjectCount"
              bars={[
                { key: 'malePassed', name: 'Boys', color: BOYS_COLOR },
                { key: 'femalePassed', name: 'Girls', color: GIRLS_COLOR },
              ]}
              height={288}
            />
          </ChartCard>
          <ChartCard title="Students by Subjects Failed">
            <AnalyticsBarChart
              data={subjectWiseCount}
              xKey="subjectCount"
              bars={[
                { key: 'maleFailed', name: 'Boys', color: BOYS_COLOR },
                { key: 'femaleFailed', name: 'Girls', color: GIRLS_COLOR },
              ]}
              height={288}
            />
          </ChartCard>
        </div>
      )}
    </div>
  );
}

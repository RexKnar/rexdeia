'use client';

import { UserCheck2, UserMinus2, UserPlus2, Users2 } from 'lucide-react';

import { DashboardWidget } from '@/components/DashboardWidget';

import type {
  DashboardRosterFilter,
  StudentDashboardStats,
} from '../../../../api/student/service';

type StudentsWidgetContainerProps = {
  readonly stats: StudentDashboardStats;
  readonly onSelect: (filter: DashboardRosterFilter, title: string) => void;
};

export function StudentsWidgetContainer({
  stats,
  onSelect,
}: StudentsWidgetContainerProps) {
  const widgetList: {
    value: number;
    label: string;
    icon: typeof Users2;
    className: string;
    filter: DashboardRosterFilter;
  }[] = [
    {
      value: stats.total,
      label: 'Total Students',
      icon: Users2,
      className: 'bg-green-100 text-green-800',
      filter: { scope: 'active' },
    },
    {
      value: stats.newAdmissions,
      label: 'New Admissions',
      icon: UserPlus2,
      className: 'bg-yellow-100 text-yellow-800',
      filter: { scope: 'newAdmissions' },
    },
    {
      value: stats.boys + stats.girls + stats.others,
      label: 'Active Roster',
      icon: UserCheck2,
      className: 'bg-blue-100 text-blue-800',
      filter: { scope: 'active' },
    },
    {
      value: stats.discontinued,
      label: 'Discontinued / Transferred',
      icon: UserMinus2,
      className: 'bg-red-100 text-red-800',
      filter: { scope: 'discontinued' },
    },
  ];

  return (
    <section className="mt-4 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {widgetList.map((widget) => (
        <DashboardWidget
          key={widget.label}
          icon={widget.icon}
          label={widget.label}
          value={widget.value}
          className={widget.className}
          onClick={() => onSelect(widget.filter, widget.label)}
        />
      ))}
    </section>
  );
}

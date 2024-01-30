'use client';

import {
  LucideBellMinus,
  LucideFileWarning,
  LucidePartyPopper,
  UserCircle2,
} from 'lucide-react';

import { DashboardWidget } from '../../../../../lib/components/DashboardWidget';

const widgetList = [
  {
    value: 150,
    label: 'Total Students',
    icon: UserCircle2,
    className: 'bg-green-100 text-green-800',
  },
  {
    value: 200,
    label: 'Students Enrolled today',
    icon: LucidePartyPopper,
    className: 'bg-yellow-100 text-yellow-800',
  },
  {
    value: 3000,
    label: 'Students on leave',
    icon: LucideFileWarning,
    className: 'bg-blue-100 text-blue-800',
  },
  {
    value: 0,
    label: 'Students with due fees',
    icon: LucideBellMinus,
    className: 'bg-red-100 text-red-800',
  },
];

export function StudentsWidgetContainer() {
  return (
    <section className="mt-4 flex w-full gap-3">
      {widgetList.map((widget) => (
        <DashboardWidget
          key={widget.label}
          icon={widget.icon}
          label={widget.label}
          value={widget.value}
          className={widget.className}
        />
      ))}
    </section>
  );
}

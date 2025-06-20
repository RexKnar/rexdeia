'use client';

import {
  ArrowUp,
  LucideSchool,
  LucideUserCog,
  LucideUsers,
} from 'lucide-react';

import { ClassDashboardWidget } from './ClassDashboardWidget';

const complexWidget = [
  {
    value: 100,
    percentage: '-',
    label: 'Total Students',
    icon: ArrowUp,
    className: 'bg-green-100 text-green-800',
    subData: [
      { title: 'Male', value: 120 },
      { title: 'Female', value: 100 },
    ],
  },
];

const simpleWidgets = [
  {
    value: 25,
    label: 'Total Staff',
    icon: LucideUsers,
    className: 'bg-yellow-100 text-yellow-800',
  },
  {
    value: 280,
    label: 'Primary Students',
    icon: LucideSchool,
    className: 'bg-cyan-100 text-cyan-800',
  },
  {
    value: 200,
    label: 'Secondary Students',
    icon: LucideSchool,
    className: 'bg-purple-100 text-purple-800',
  },
  {
    value: 10,
    label: 'Class Incharges',
    icon: LucideUserCog,
    className: 'bg-red-100 text-red-800',
  },
];

export function ClassWidgetContainer() {
  return (
    <section className="mt-6 grid w-full gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {complexWidget.map((item) => (
        <ClassDashboardWidget
          key={item.label}
          icon={item.icon}
          value={item.value}
          percentage={item.percentage}
          label={item.label}
          className={item.className}
          subData={item.subData}
        />
      ))}

      {simpleWidgets.map((item) => (
        <ClassDashboardWidget
          key={item.label}
          icon={item.icon}
          value={item.value}
          label={item.label}
          className={item.className}
        />
      ))}
    </section>
  );
}

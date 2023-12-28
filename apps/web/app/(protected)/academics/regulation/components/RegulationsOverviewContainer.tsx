'use client';

import { Brain, Wheat, WheatOff } from 'lucide-react';
import React from 'react';

import { DashboardWidget } from '../../../../../lib/components/DashboardWidget';

const widgetList = [
  {
    value: 150,
    label: 'Active Regulations',
    icon: Wheat,
    className: 'bg-green-100 text-green-800',
  },
  {
    value: 200,
    label: 'Inactive Regulations',
    icon: WheatOff,
    className: 'bg-red-100 text-red-800',
  },
  {
    value: 3000,
    label: 'Total Regulations',
    icon: Brain,
    className: 'bg-blue-100 text-blue-800',
  },
];

export function RegulationsOverviewContainer() {
  return (
    <section className="gap-auto mt-4 flex justify-between pr-6 pt-2 ">
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

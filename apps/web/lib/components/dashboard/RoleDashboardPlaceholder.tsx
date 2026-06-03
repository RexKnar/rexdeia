import { LucideIcon } from 'lucide-react';

import { PageTitle } from '../PageTitle';

type Stat = {
  title: string;
  count: string | number;
  icon: LucideIcon;
};

type RoleDashboardPlaceholderProps = {
  heading: string;
  description?: string;
  stats: Stat[];
};

/**
 * Placeholder shell for the role-specific dashboards (HM / AHM / Staff /
 * class teacher). Renders a heading and a row of stat cards with placeholder
 * counts. Real widgets/queries are wired in a follow-up.
 */
export function RoleDashboardPlaceholder({
  heading,
  description,
  stats,
}: RoleDashboardPlaceholderProps) {
  return (
    <section>
      <PageTitle title={heading} />
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="flex items-center rounded-md border border-blue-100 bg-white p-4"
            >
              <div className="rounded-full bg-blue-50 p-3">
                <Icon size={22} className="text-primary-600" />
              </div>
              <div className="ml-4">
                <span className="text-xs text-gray-700">{stat.title}</span>
                <h1 className="font-semibold">{stat.count}</h1>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mx-auto my-5 rounded-md bg-white p-6 text-sm text-gray-500">
        More widgets coming soon.
      </div>
    </section>
  );
}

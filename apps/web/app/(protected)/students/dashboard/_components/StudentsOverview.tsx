'use client';

import { useState } from 'react';

import type {
  DashboardRosterFilter,
  StudentDashboardStats,
} from '../../../../api/student/service';
import { ClassDistribution } from './ClassDistribution';
import { GenderSplitCard } from './GenderSplitCard';
import { StudentRosterDialog } from './StudentRosterDialog';
import { StudentsWidgetContainer } from './StudentsWidgetContainer';

type StudentsOverviewProps = {
  readonly stats: StudentDashboardStats;
};

type ActiveRoster = {
  filter: DashboardRosterFilter;
  title: string;
};

export function StudentsOverview({ stats }: StudentsOverviewProps) {
  const [active, setActive] = useState<ActiveRoster | null>(null);

  const open = (filter: DashboardRosterFilter, title: string) =>
    setActive({ filter, title });

  return (
    <>
      <section className="flex flex-col gap-3 rounded-md bg-white p-6 shadow-sm sm:p-8">
        <section>
          <p className="text-lg font-semibold text-gray-800 sm:text-xl">
            Students Overview
          </p>
          <p className="text-sm text-gray-700 sm:text-base">
            Statistics for the academic year selected in the sidebar. Click any
            figure to view and download that student list.
          </p>

          {!stats.hasBatchSelected ? (
            <div className="mt-6 rounded-md border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-700">
              Select an academic year from the sidebar to view student
              statistics.
            </div>
          ) : (
            <StudentsWidgetContainer stats={stats} onSelect={open} />
          )}
        </section>
      </section>

      {stats.hasBatchSelected && stats.total > 0 && (
        <>
          <section className="flex flex-col gap-4 rounded-md bg-white p-6 shadow-sm sm:p-8">
            <section>
              <p className="text-lg font-semibold text-gray-800 sm:text-xl">
                By Medium
              </p>
              <p className="text-sm text-gray-700 sm:text-base">
                Medium-wise student count with boys and girls split.
              </p>
            </section>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <GenderSplitCard
                title="All Mediums"
                total={stats.total}
                boys={stats.boys}
                girls={stats.girls}
                others={stats.others}
                highlight
                onClick={() => open({ scope: 'active' }, 'All Students')}
              />
              {stats.mediums.map((medium) => (
                <GenderSplitCard
                  key={medium.mediumId ?? medium.mediumName}
                  title={`${medium.mediumName} Medium`}
                  total={medium.total}
                  boys={medium.boys}
                  girls={medium.girls}
                  others={medium.others}
                  onClick={() =>
                    medium.mediumId &&
                    open(
                      { scope: 'active', mediumId: medium.mediumId },
                      `${medium.mediumName} Medium Students`
                    )
                  }
                />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4 rounded-md bg-white p-6 shadow-sm sm:p-8">
            <section>
              <p className="text-lg font-semibold text-gray-800 sm:text-xl">
                By Class
              </p>
              <p className="text-sm text-gray-700 sm:text-base">
                Distribution of active students across classes. Click a class to
                view its list.
              </p>
            </section>
            <ClassDistribution
              classes={stats.classes}
              onSelectClass={(classId, className) =>
                open(
                  { scope: 'active', classId },
                  `${className} - Student List`
                )
              }
            />
          </section>
        </>
      )}

      <StudentRosterDialog
        filter={active?.filter ?? null}
        title={active?.title ?? ''}
        onClose={() => setActive(null)}
      />
    </>
  );
}

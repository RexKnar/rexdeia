'use client';

import { useGetHolidaysQuery } from 'lib/queries/timetable/useHolidaysQuery';
import { CalendarOff, Loader2 } from 'lucide-react';

function fmt(d: string) {
  return new Date(`${d}T00:00:00`).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function UpcomingHolidays() {
  const { data, isLoading } = useGetHolidaysQuery({ upcoming: true });

  return (
    <section className="rounded-md border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <CalendarOff size={18} className="text-primary" />
        <h3 className="font-semibold text-gray-800">Upcoming Holidays</h3>
      </div>
      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : !data?.length ? (
        <p className="text-sm text-gray-500">No upcoming holidays.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {data.map((h) => (
            <li
              key={h.id}
              className="flex items-center justify-between gap-3 rounded-md border border-rose-100 bg-rose-50/50 px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">{h.name}</p>
                {h.description && (
                  <p className="text-xs text-gray-500">{h.description}</p>
                )}
              </div>
              <span className="whitespace-nowrap text-xs text-rose-700">
                {h.startDate === h.endDate
                  ? fmt(h.startDate)
                  : `${fmt(h.startDate)} – ${fmt(h.endDate)}`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

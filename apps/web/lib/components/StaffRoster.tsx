'use client';

import { useGetStaffRosterQuery } from 'lib/queries/timetable/useGetStaffRosterQuery';
import { ArrowLeftRight, CalendarClock, Clock, Loader2 } from 'lucide-react';

function localToday() {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

export function StaffRoster({ staffId }: { staffId?: string }) {
  const date = localToday();
  const { data, isLoading } = useGetStaffRosterQuery({ staffId, date });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-md bg-white p-8 text-gray-600 shadow-sm">
        <Loader2 className="h-5 w-5 animate-spin text-primary" /> Loading
        timetable…
      </div>
    );
  }

  if (!data?.staff) {
    return (
      <div className="rounded-md border border-dashed bg-gray-50 p-6 text-center text-sm text-gray-600">
        No staff record is linked to view a timetable.
      </div>
    );
  }

  const hasAnyPeriods = Object.values(data.weeklyByDay).some(
    (arr) => arr.length > 0
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Today */}
      <section className="rounded-md border bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <CalendarClock size={18} className="text-primary" />
          <h3 className="font-semibold text-gray-800">
            Today · {data.today?.dayName}
          </h3>
          <span className="text-sm text-gray-500">{data.today?.date}</span>
        </div>
        {!data.today?.periods.length ? (
          <p className="text-sm text-gray-500">No periods scheduled today.</p>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {data.today.periods.map((p, i) => (
              <div
                key={i}
                className={`rounded-md border p-3 ${
                  p.type === 'covered'
                    ? 'border-gray-200 bg-gray-50'
                    : p.type === 'substitution'
                      ? 'border-amber-200 bg-amber-50'
                      : 'border-indigo-100 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-800">
                    {p.subjectName}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock size={12} />
                    {p.startTime}–{p.endTime}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {p.slotLabel} · {p.sectionName}
                </p>
                {p.type === 'covered' && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                    <ArrowLeftRight size={12} /> Covered by {p.otherStaffName}
                  </p>
                )}
                {p.type === 'substitution' && (
                  <p className="mt-1 flex items-center gap-1 text-xs font-medium text-amber-700">
                    <ArrowLeftRight size={12} /> Substituting for{' '}
                    {p.otherStaffName}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Weekly grid */}
      <section className="overflow-x-auto rounded-md border bg-white shadow-sm">
        <div className="border-b p-3">
          <h3 className="font-semibold text-gray-800">Weekly Timetable</h3>
        </div>
        {!hasAnyPeriods ? (
          <p className="p-6 text-center text-sm text-gray-500">
            No timetable has been assigned yet.
          </p>
        ) : (
          <div
            className="grid min-w-[700px]"
            style={{
              gridTemplateColumns: `repeat(${data.days.length}, minmax(0, 1fr))`,
            }}
          >
            {data.days.map((day) => (
              <div key={day.id} className="border-r last:border-r-0">
                <div className="border-b bg-gray-50 p-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-600">
                  {day.name}
                </div>
                <div className="flex flex-col gap-2 p-2">
                  {(data.weeklyByDay[day.id] ?? []).length === 0 ? (
                    <span className="py-4 text-center text-xs text-gray-300">
                      —
                    </span>
                  ) : (
                    (data.weeklyByDay[day.id] ?? []).map((p) => (
                      <div
                        key={p.entryId}
                        className="rounded-md border border-indigo-100 bg-indigo-50/40 p-2"
                      >
                        <p className="text-xs font-semibold text-gray-800">
                          {p.subjectName}
                        </p>
                        <p className="text-[11px] text-gray-600">
                          {p.sectionName}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {p.startTime}–{p.endTime}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

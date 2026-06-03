'use client';

import { PeriodStatsScope } from 'lib/domain/timetable';
import { useGetPeriodStatsQuery } from 'lib/queries/timetable/useGetPeriodStatsQuery';
import { CalendarRange, Loader2 } from 'lucide-react';
import { useState } from 'react';

/** Sensible default range: the current (June–April) academic year. */
function academicYearRange() {
  const now = new Date();
  const y = now.getFullYear();
  const startYear = now.getMonth() >= 5 ? y : y - 1;
  return { from: `${startYear}-06-01`, to: `${startYear + 1}-04-30` };
}

export function PeriodStatsCard({
  scope,
  id = 'me',
  title = 'Period Statistics',
}: {
  scope: PeriodStatsScope;
  id?: string;
  title?: string;
}) {
  const defaults = academicYearRange();
  const [from, setFrom] = useState(defaults.from);
  const [to, setTo] = useState(defaults.to);

  const { data, isFetching } = useGetPeriodStatsQuery(
    { scope, id, from, to },
    { enabled: !!from && !!to && (scope === 'staff' || !!id) }
  );

  const pct =
    data && data.totalPeriods > 0
      ? Math.round((data.completedPeriods / data.totalPeriods) * 100)
      : 0;

  return (
    <section className="rounded-md border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <CalendarRange size={18} className="text-primary" />
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <label className="text-xs font-medium text-gray-600">
          From
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="mt-1 block rounded-md border px-2 py-1.5 text-sm"
          />
        </label>
        <label className="text-xs font-medium text-gray-600">
          To
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="mt-1 block rounded-md border px-2 py-1.5 text-sm"
          />
        </label>
      </div>

      {isFetching && !data ? (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Calculating…
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="Total periods" value={data?.totalPeriods ?? 0} accent="text-indigo-700" />
            <Stat label="Completed" value={data?.completedPeriods ?? 0} accent="text-green-700" />
            <Stat label="Remaining" value={data?.remainingPeriods ?? 0} accent="text-amber-700" />
            <Stat label="Holidays" value={data?.holidayDays ?? 0} accent="text-rose-700" />
          </div>
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-xs text-gray-500">
              <span>{data?.workingDays ?? 0} working days</span>
              <span>{pct}% completed</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="rounded-md border bg-gray-50/60 p-3 text-center">
      <p className={`text-2xl font-semibold ${accent}`}>{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

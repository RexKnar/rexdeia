'use client';

import { TimetableGridData } from 'lib/domain/timetable';
import { PeriodStatsCard } from 'lib/components/PeriodStatsCard';
import { UpcomingHolidays } from 'lib/components/UpcomingHolidays';
import { useGetClassListQuery } from 'lib/queries/class/useGetClassListQuery';
import { useGetAllSectionByClassIdQuery } from 'lib/queries/section/useGetAllSectionsByClassIdQuery';
import { useGetTimetableGridQuery } from 'lib/queries/timetable/useGetTimetableGridQuery';
import { useSaveTimetableGridMutationQuery } from 'lib/queries/timetable/useSaveTimetableGridMutationQuery';
import { AlertTriangle, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Button, toast } from 'ui';

import { SearchableSelect } from '@/components/SearchableSelect';

type CellValue = { subjectId: string | null; staffId: string | null };

const cellKey = (dayId: string, slotId: string) => `${dayId}|${slotId}`;

export function PeriodTableBuilder() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const classId = searchParams.get('classId') ?? '';
  const sectionId = searchParams.get('sectionId') ?? '';

  const [cells, setCells] = useState<Record<string, CellValue>>({});
  const [dayOffs, setDayOffs] = useState<Set<string>>(new Set());

  const { data: classList } = useGetClassListQuery({
    page: 1,
    limit: 999,
    filter: {},
  });
  const { data: sectionList } = useGetAllSectionByClassIdQuery(
    { filter: {}, classId },
    { enabled: !!classId }
  );
  const { data: grid, isFetching } = useGetTimetableGridQuery(
    { sectionId },
    { enabled: !!sectionId }
  );
  const saveMutation = useSaveTimetableGridMutationQuery();

  useEffect(() => {
    if (!grid) return;
    const initial: Record<string, CellValue> = {};
    grid.entries.forEach((e) => {
      initial[cellKey(e.dayId, e.slotId)] = {
        subjectId: e.subjectId,
        staffId: e.staffId,
      };
    });
    setCells(initial);
    setDayOffs(new Set(grid.dayOffs ?? []));
  }, [grid]);

  const conflictKeys = useMemo(() => {
    const set = new Set<string>();
    grid?.conflicts.forEach((c) => set.add(cellKey(c.dayId, c.slotId)));
    return set;
  }, [grid]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    if (key === 'classId') params.delete('sectionId');
    router.replace(`${pathname}?${params.toString()}`);
  };

  const staffForSubject = (subjectId: string | null) =>
    subjectId
      ? (grid?.staff ?? []).filter((s) => s.subjectIds.includes(subjectId))
      : [];

  const setSubject = (dayId: string, slotId: string, subjectId: string) => {
    const candidates = staffForSubject(subjectId || null);
    setCells((prev) => ({
      ...prev,
      [cellKey(dayId, slotId)]: {
        subjectId: subjectId || null,
        staffId: subjectId ? candidates[0]?.id ?? null : null,
      },
    }));
  };

  const setStaff = (dayId: string, slotId: string, staffId: string) =>
    setCells((prev) => ({
      ...prev,
      [cellKey(dayId, slotId)]: {
        subjectId: prev[cellKey(dayId, slotId)]?.subjectId ?? null,
        staffId: staffId || null,
      },
    }));

  const toggleDayOff = (dayId: string) =>
    setDayOffs((prev) => {
      const next = new Set(prev);
      if (next.has(dayId)) next.delete(dayId);
      else next.add(dayId);
      return next;
    });

  const handleSave = async () => {
    if (!grid?.structure) return;
    const periodSlots = grid.structure.slots.filter((s) => s.kind === 'Period');
    const entries = grid.days
      .filter((day) => !dayOffs.has(day.id))
      .flatMap((day) =>
        periodSlots.map((slot) => {
          const v = cells[cellKey(day.id, slot.id)] ?? {
            subjectId: null,
            staffId: null,
          };
          return {
            dayId: day.id,
            slotId: slot.id,
            subjectId: v.subjectId,
            staffId: v.staffId,
          };
        })
      );
    try {
      await saveMutation.mutateAsync({
        sectionId,
        entries,
        dayOffs: Array.from(dayOffs),
      });
      toast({ title: 'Period table saved', variant: 'default' });
    } catch {
      toast({ title: 'Error saving period table', variant: 'default' });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <section className="grid grid-cols-1 gap-4 rounded-md border bg-white p-4 shadow-sm md:grid-cols-2">
        <SearchableSelect
          label="Class"
          value={classId}
          onChange={(v) => updateParam('classId', v)}
          options={classList?.data ?? []}
          placeholder="Select class"
        />
        <SearchableSelect
          label="Section"
          value={sectionId}
          onChange={(v) => updateParam('sectionId', v)}
          options={sectionList?.data ?? []}
          placeholder="Select section"
          disabled={!classId}
        />
      </section>

      {!sectionId ? (
        <Placeholder text="Select a class and section to build its timetable." />
      ) : isFetching && !grid ? (
        <LoadingState />
      ) : !grid?.structure ? (
        <section className="rounded-md border border-dashed bg-amber-50 p-6 text-center text-sm text-amber-800">
          No timetable structure found for this section&apos;s class level.{' '}
          <Link href="/timeTable/structure" className="font-semibold underline">
            Define the structure first
          </Link>
          .
        </section>
      ) : grid.subjects.length === 0 ? (
        <Placeholder text="No subjects/staff are assigned to this section yet. Assign teaching staff to the section first, then build the timetable." />
      ) : (
        <TimetableGrid
          grid={grid}
          cells={cells}
          dayOffs={dayOffs}
          conflictKeys={conflictKeys}
          setSubject={setSubject}
          setStaff={setStaff}
          toggleDayOff={toggleDayOff}
          staffForSubject={staffForSubject}
        />
      )}

      {grid?.structure && grid.subjects.length > 0 && (
        <>
          {grid.conflicts.length > 0 && (
            <section className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">
                  {grid.conflicts.length} staff conflict(s) detected
                </p>
                <ul className="mt-1 list-inside list-disc">
                  {grid.conflicts.map((c, i) => (
                    <li key={i}>
                      {c.staffName} is also booked in {c.withSection} at {c.time}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}
          <section className="flex justify-end">
            <Button
              variant="default"
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="gap-1"
            >
              {saveMutation.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Save Timetable
            </Button>
          </section>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <PeriodStatsCard
              scope="section"
              id={sectionId}
              title="Section Period Statistics"
            />
            <UpcomingHolidays />
          </div>
        </>
      )}
    </div>
  );
}

function TimetableGrid({
  grid,
  cells,
  dayOffs,
  conflictKeys,
  setSubject,
  setStaff,
  toggleDayOff,
  staffForSubject,
}: {
  grid: TimetableGridData;
  cells: Record<string, CellValue>;
  dayOffs: Set<string>;
  conflictKeys: Set<string>;
  setSubject: (dayId: string, slotId: string, subjectId: string) => void;
  setStaff: (dayId: string, slotId: string, staffId: string) => void;
  toggleDayOff: (dayId: string) => void;
  staffForSubject: (
    subjectId: string | null
  ) => { id: string; name: string; subjectIds: string[] }[];
}) {
  const slots = grid.structure!.slots;
  const rowCount = grid.days.length;

  return (
    <section className="overflow-x-auto rounded-md border bg-white p-2 shadow-sm">
      <table className="w-full border-separate border-spacing-1">
        <tbody>
          {grid.days.map((day, rowIndex) => {
            const isOff = dayOffs.has(day.id);
            return (
              <tr key={day.id}>
                {/* Weekday label + day-off toggle */}
                <td className="w-32 rounded-md bg-purple-100 p-3 align-middle">
                  <p className="font-medium capitalize text-purple-900">
                    {day.name}
                  </p>
                  <button
                    onClick={() => toggleDayOff(day.id)}
                    className={`mt-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      isOff
                        ? 'bg-red-200 text-red-800'
                        : 'bg-white/70 text-purple-700 hover:bg-white'
                    }`}
                  >
                    {isOff ? 'Day Off' : 'Mark off'}
                  </button>
                </td>

                {slots.map((slot) => {
                  // Interval: a single vertical yellow column spanning all rows
                  // (always anchored on the first row so the column stays intact
                  // even when some days are marked off).
                  if (slot.kind === 'Interval') {
                    if (rowIndex !== 0) return null;
                    return (
                      <td
                        key={slot.id}
                        rowSpan={rowCount}
                        className="w-12 rounded-md bg-amber-200 p-1 text-center align-middle"
                      >
                        <div className="mx-auto flex items-center justify-center [writing-mode:vertical-rl]">
                          <span className="rotate-180 whitespace-nowrap text-xs font-medium text-amber-900">
                            {slot.label}
                            {slot.intervalType ? ` · ${slot.intervalType}` : ''} ·{' '}
                            {slot.startTime}–{slot.endTime}
                          </span>
                        </div>
                      </td>
                    );
                  }

                  if (isOff) {
                    return (
                      <td
                        key={slot.id}
                        className="min-w-[150px] rounded-md bg-red-50 p-2 text-center align-middle text-xs font-medium text-red-400"
                      >
                        Off
                      </td>
                    );
                  }

                  const key = cellKey(day.id, slot.id);
                  const value = cells[key] ?? {
                    subjectId: null,
                    staffId: null,
                  };
                  const isConflict = conflictKeys.has(key);
                  const staffOptions = staffForSubject(value.subjectId);
                  return (
                    <td
                      key={slot.id}
                      className={`min-w-[150px] rounded-md bg-emerald-100 p-2 align-top ${
                        isConflict ? 'ring-2 ring-inset ring-red-400' : ''
                      }`}
                    >
                      <div className="mb-1 flex items-center justify-between text-[11px] text-emerald-800">
                        <span className="font-semibold">{slot.label}</span>
                        {slot.periodType?.name && (
                          <span>{slot.periodType.name}</span>
                        )}
                      </div>
                      <select
                        value={value.subjectId ?? ''}
                        onChange={(e) =>
                          setSubject(day.id, slot.id, e.target.value)
                        }
                        className="mb-1 w-full rounded border-0 bg-white/80 px-1.5 py-1 text-xs"
                      >
                        <option value="">— Subject —</option>
                        {grid.subjects.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                      <select
                        value={value.staffId ?? ''}
                        onChange={(e) =>
                          setStaff(day.id, slot.id, e.target.value)
                        }
                        disabled={!value.subjectId}
                        className="w-full rounded border-0 bg-white/80 px-1.5 py-1 text-xs disabled:opacity-50"
                      >
                        <option value="">— Staff —</option>
                        {staffOptions.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

function Placeholder({ text }: { text: string }) {
  return (
    <section className="rounded-md border border-dashed bg-gray-50 p-8 text-center text-sm text-gray-600">
      {text}
    </section>
  );
}

function LoadingState() {
  return (
    <section className="flex items-center justify-center gap-2 rounded-md bg-white p-8 text-gray-600 shadow-sm">
      <Loader2 className="h-5 w-5 animate-spin text-primary" /> Loading…
    </section>
  );
}

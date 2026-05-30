'use client';

import { computeTimetableSlots } from 'lib/domain/computeTimetableSlots';
import {
  IntervalType,
  SlotKind,
  TimetableSlotInput,
} from 'lib/domain/timetable';
import { useGetClassLevelListQuery } from 'lib/queries/classLevel/useGetClassLevelsListQuery';
import { useGetPeriodTypeListQuery } from 'lib/queries/periodType/useGetPeriodTypeListQuery';
import { useDeleteTimetableStructureMutationQuery } from 'lib/queries/timetable/useDeleteTimetableStructureMutationQuery';
import { useGetTimetableStructuresQuery } from 'lib/queries/timetable/useGetTimetableStructuresQuery';
import { useSaveTimetableStructureMutationQuery } from 'lib/queries/timetable/useSaveTimetableStructureMutationQuery';
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Coffee,
  Loader2,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button, Input, toast } from 'ui';

import { SearchableSelect } from '@/components/SearchableSelect';

type SlotDraft = {
  localId: string;
  kind: SlotKind;
  label: string;
  durationMins: number;
  periodTypeId: string | null;
  intervalType: IntervalType | null;
};

const INTERVAL_TYPES: { value: IntervalType; label: string }[] = [
  { value: 'Lunch', label: 'Lunch' },
  { value: 'RefreshmentBreak', label: 'Refreshment Break' },
  { value: 'Other', label: 'Other' },
];

export function TimetableStructureBuilder() {
  const idCounter = useRef(0);
  const nextId = () => `slot-${idCounter.current++}`;

  const [classLevelId, setClassLevelId] = useState('');
  const [structureId, setStructureId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [dayStartTime, setDayStartTime] = useState('09:00');
  const [slots, setSlots] = useState<SlotDraft[]>([]);
  const [genCount, setGenCount] = useState(6);
  const [genDuration, setGenDuration] = useState(45);

  const { data: classLevels } = useGetClassLevelListQuery({
    page: 1,
    limit: 999,
  });
  const { data: periodTypes } = useGetPeriodTypeListQuery({
    page: 1,
    limit: 999,
  });
  const { data: structures, isFetching } = useGetTimetableStructuresQuery(
    { classLevelId },
    { enabled: !!classLevelId }
  );

  const saveMutation = useSaveTimetableStructureMutationQuery();
  const deleteMutation = useDeleteTimetableStructureMutationQuery();

  const defaultPeriodTypeId = periodTypes?.[0]?.id ?? null;

  // Load the existing structure for the selected class level, or reset to a
  // fresh draft if none exists yet.
  useEffect(() => {
    if (!classLevelId || !structures) return;
    const existing = structures[0];
    if (existing) {
      setStructureId(existing.id);
      setName(existing.name);
      setDayStartTime(existing.dayStartTime);
      setSlots(
        existing.slots.map((s) => ({
          localId: nextId(),
          kind: s.kind,
          label: s.label,
          durationMins: s.durationMins,
          periodTypeId: s.periodTypeId ?? null,
          intervalType: s.intervalType ?? null,
        }))
      );
    } else {
      const levelName =
        classLevels?.find((c) => c.id === classLevelId)?.name ?? '';
      setStructureId(null);
      setName(levelName ? `${levelName} Timetable` : 'Timetable');
      setSlots([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [structures, classLevelId]);

  const periodCount = slots.filter((s) => s.kind === 'Period').length;

  const addPeriod = () =>
    setSlots((prev) => [
      ...prev,
      {
        localId: nextId(),
        kind: 'Period',
        label: `Period ${prev.filter((s) => s.kind === 'Period').length + 1}`,
        durationMins: genDuration,
        periodTypeId: defaultPeriodTypeId,
        intervalType: null,
      },
    ]);

  const addInterval = () =>
    setSlots((prev) => [
      ...prev,
      {
        localId: nextId(),
        kind: 'Interval',
        label: 'Break',
        durationMins: 15,
        periodTypeId: null,
        intervalType: 'RefreshmentBreak',
      },
    ]);

  const generatePeriods = () => {
    const generated: SlotDraft[] = Array.from({ length: genCount }, (_, i) => ({
      localId: nextId(),
      kind: 'Period',
      label: `Period ${i + 1}`,
      durationMins: genDuration,
      periodTypeId: defaultPeriodTypeId,
      intervalType: null,
    }));
    setSlots(generated);
  };

  const updateSlot = (localId: string, patch: Partial<SlotDraft>) =>
    setSlots((prev) =>
      prev.map((s) => (s.localId === localId ? { ...s, ...patch } : s))
    );

  const removeSlot = (localId: string) =>
    setSlots((prev) => prev.filter((s) => s.localId !== localId));

  const moveSlot = (localId: string, dir: -1 | 1) =>
    setSlots((prev) => {
      const idx = prev.findIndex((s) => s.localId === localId);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[target]] = [copy[target], copy[idx]];
      return copy;
    });

  const computed = computeTimetableSlots(
    dayStartTime,
    slots.map(
      (s): TimetableSlotInput => ({
        kind: s.kind,
        label: s.label,
        durationMins: s.durationMins,
        periodTypeId: s.periodTypeId,
        intervalType: s.intervalType,
      })
    )
  );

  const dayEndTime = computed.length ? computed[computed.length - 1].endTime : dayStartTime;

  const handleSave = async () => {
    if (!classLevelId) {
      toast({ title: 'Select a class level', variant: 'default' });
      return;
    }
    if (slots.length === 0) {
      toast({ title: 'Add at least one period', variant: 'default' });
      return;
    }
    try {
      await saveMutation.mutateAsync({
        id: structureId ?? undefined,
        name,
        classLevelId,
        dayStartTime,
        slots: slots.map((s) => ({
          kind: s.kind,
          label: s.label,
          durationMins: Number(s.durationMins) || 0,
          periodTypeId: s.periodTypeId,
          intervalType: s.intervalType,
        })),
      });
      toast({ title: 'Timetable structure saved', variant: 'default' });
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Could not save the structure.',
        variant: 'default',
      });
    }
  };

  const handleDelete = async () => {
    if (!structureId) return;
    try {
      await deleteMutation.mutateAsync(structureId);
      setStructureId(null);
      setSlots([]);
      toast({ title: 'Structure deleted', variant: 'default' });
    } catch (e) {
      toast({ title: 'Error deleting structure', variant: 'default' });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Configuration */}
      <section className="grid grid-cols-1 gap-4 rounded-md border bg-white p-4 shadow-sm md:grid-cols-3">
        <SearchableSelect
          label="Class Level"
          value={classLevelId}
          onChange={setClassLevelId}
          options={classLevels ?? []}
          placeholder="Select class level"
        />
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Structure Name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!classLevelId}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Day Start Time
          </label>
          <Input
            type="time"
            value={dayStartTime}
            onChange={(e) => setDayStartTime(e.target.value)}
            disabled={!classLevelId}
          />
        </div>
      </section>

      {!classLevelId ? (
        <section className="rounded-md border border-dashed bg-gray-50 p-8 text-center text-sm text-gray-600">
          Select a class level to define or edit its timetable structure.
        </section>
      ) : isFetching && slots.length === 0 ? (
        <section className="flex items-center justify-center gap-2 rounded-md bg-white p-8 text-gray-600 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-primary" /> Loading…
        </section>
      ) : (
        <>
          {/* Quick generate */}
          <section className="flex flex-wrap items-end gap-3 rounded-md border bg-white p-4 shadow-sm">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-600">
                No. of periods
              </label>
              <Input
                type="number"
                min={1}
                value={genCount}
                onChange={(e) => setGenCount(Number(e.target.value))}
                className="w-28"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-600">
                Period duration (min)
              </label>
              <Input
                type="number"
                min={1}
                value={genDuration}
                onChange={(e) => setGenDuration(Number(e.target.value))}
                className="w-36"
              />
            </div>
            <Button variant="mild" onClick={generatePeriods}>
              Generate periods
            </Button>
            <span className="text-xs text-gray-500">
              (replaces the list below — then add intervals where needed)
            </span>
          </section>

          {/* Slot editor with live timings */}
          <section className="overflow-x-auto rounded-md border bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-600">
                  <th className="p-3">#</th>
                  <th className="p-3">Kind</th>
                  <th className="p-3">Label</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Session</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {slots.map((slot, index) => {
                  const c = computed[index];
                  const isInterval = slot.kind === 'Interval';
                  return (
                    <tr
                      key={slot.localId}
                      className={`border-b ${isInterval ? 'bg-amber-50' : ''}`}
                    >
                      <td className="p-3 text-gray-500">{index + 1}</td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                            isInterval
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {isInterval ? (
                            <Coffee size={12} />
                          ) : (
                            <BookOpen size={12} />
                          )}
                          {slot.kind}
                        </span>
                      </td>
                      <td className="p-3">
                        <Input
                          value={slot.label}
                          onChange={(e) =>
                            updateSlot(slot.localId, { label: e.target.value })
                          }
                          className="w-32"
                        />
                      </td>
                      <td className="p-3">
                        {isInterval ? (
                          <select
                            value={slot.intervalType ?? 'Other'}
                            onChange={(e) =>
                              updateSlot(slot.localId, {
                                intervalType: e.target.value as IntervalType,
                              })
                            }
                            className="rounded-md border px-2 py-1.5 text-sm"
                          >
                            {INTERVAL_TYPES.map((t) => (
                              <option key={t.value} value={t.value}>
                                {t.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <select
                            value={slot.periodTypeId ?? ''}
                            onChange={(e) =>
                              updateSlot(slot.localId, {
                                periodTypeId: e.target.value || null,
                              })
                            }
                            className="rounded-md border px-2 py-1.5 text-sm"
                          >
                            <option value="">—</option>
                            {periodTypes?.map((pt) => (
                              <option key={pt.id} value={pt.id}>
                                {pt.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="p-3">
                        <Input
                          type="number"
                          min={0}
                          value={slot.durationMins}
                          onChange={(e) =>
                            updateSlot(slot.localId, {
                              durationMins: Number(e.target.value),
                            })
                          }
                          className="w-20"
                        />
                      </td>
                      <td className="whitespace-nowrap p-3 text-gray-700">
                        {c?.startTime} – {c?.endTime}
                      </td>
                      <td className="p-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            c?.session === 'Afternoon'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-sky-100 text-sky-700'
                          }`}
                        >
                          {c?.session}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="mild"
                            className="h-auto px-2 py-1"
                            onClick={() => moveSlot(slot.localId, -1)}
                          >
                            <ArrowUp size={14} />
                          </Button>
                          <Button
                            variant="mild"
                            className="h-auto px-2 py-1"
                            onClick={() => moveSlot(slot.localId, 1)}
                          >
                            <ArrowDown size={14} />
                          </Button>
                          <Button
                            variant="mild"
                            className="h-auto px-2 py-1"
                            onClick={() => removeSlot(slot.localId)}
                          >
                            <Trash2 size={14} className="text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {slots.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-gray-500">
                      No slots yet. Generate periods above or add them manually.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

          {/* Add buttons + summary */}
          <section className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              <Button variant="mild" onClick={addPeriod} className="gap-1">
                <Plus size={16} /> Add Period
              </Button>
              <Button variant="mild" onClick={addInterval} className="gap-1">
                <Plus size={16} /> Add Interval
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              {periodCount} periods · ends at{' '}
              <span className="font-semibold text-gray-900">{dayEndTime}</span>
            </div>
          </section>

          {/* Save / delete */}
          <section className="flex items-center justify-end gap-3">
            {structureId && (
              <Button
                variant="mild"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="gap-1 text-red-600"
              >
                <Trash2 size={16} /> Delete
              </Button>
            )}
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
              {structureId ? 'Update Structure' : 'Save Structure'}
            </Button>
          </section>
        </>
      )}
    </div>
  );
}

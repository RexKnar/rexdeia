'use client';

import { useCreateExamConfigQuery } from 'lib/queries/exams/configuration/useCreateExamConfigQuery';
import { AlertTriangle, Check, Loader2, Pencil, RotateCcw } from 'lucide-react';
import { Dispatch, useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Separator,
  useToast,
} from 'ui';

import {
  buildSaveUnits,
  overrideKey,
  saveableUnits,
} from '../_lib/buildSaveUnits';
import {
  ConfigAction,
  ConfigState,
  IdName,
  ItemOverride,
  SelectedSubject,
  SharedPartition,
  SharedSubjectMarks,
} from '../_state/types';
import { makePartition, MarksRow, PartitionList } from './ConfigFields';

type Lookups = {
  examId: string;
  bySubject: Record<string, IdName[]>;
  classNameById: (id: string) => string;
  sectionNameById: (id: string) => string;
};

type Cell = {
  key: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  subject: SelectedSubject;
};

export function ReviewConfirmDialog({
  open,
  onClose,
  onSaved,
  state,
  dispatch,
  lookups,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  state: ConfigState;
  dispatch: Dispatch<ConfigAction>;
  lookups: Lookups;
}) {
  const { toast } = useToast();
  const { mutateAsync } = useCreateExamConfigQuery(lookups.examId);

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const cells: Cell[] = useMemo(() => {
    const out: Cell[] = [];
    for (const classId of state.selectedClassIds) {
      const sections = state.sectionsByClass[classId] ?? [];
      const subjects = state.subjectsByClass[classId] ?? [];
      for (const sectionId of sections) {
        for (const subject of subjects) {
          out.push({
            key: overrideKey(classId, sectionId, subject.subjectId),
            classId,
            className: lookups.classNameById(classId),
            sectionId,
            sectionName: lookups.sectionNameById(sectionId),
            subject,
          });
        }
      }
    }
    return out;
  }, [state, lookups]);

  const units = useMemo(() => buildSaveUnits(state, lookups), [state, lookups]);
  const sendable = useMemo(() => saveableUnits(units), [units]);
  const skippedCount = units.length - sendable.length;

  const warnings = useMemo(
    () => Array.from(new Set(units.flatMap((u) => u.warnings))),
    [units]
  );

  /** Which chosen formats apply to a given cell's subject vs. are skipped. */
  const formatsForCell = (cell: Cell, override?: ItemOverride) => {
    const partitions = override?.partitions ?? state.partitions;
    const owned = lookups.bySubject[cell.subject.subjectId] ?? [];
    const applicable: string[] = [];
    const skipped: string[] = [];
    partitions.forEach((p) =>
      (owned.some((f) => f.name === p.name) ? applicable : skipped).push(p.name)
    );
    return { applicable, skipped };
  };

  const hasMarks = Boolean(state.subjectMarks.totalMarks);
  const hasPartitions = state.partitions.length > 0;
  const canSave = sendable.length > 0 && hasMarks && hasPartitions && !saving;

  async function handleConfirm() {
    setSaving(true);
    setProgress({ done: 0, total: sendable.length });
    let ok = 0;
    const failed: string[] = [];
    for (const unit of sendable) {
      try {
        await mutateAsync(unit.payload as any);
        ok += 1;
      } catch {
        failed.push(`${unit.className} · ${unit.subjectLabel}`);
      }
      setProgress({ done: ok + failed.length, total: sendable.length });
    }
    setSaving(false);

    if (failed.length === 0) {
      toast({
        title: 'Configuration saved',
        description: `${ok} save${ok > 1 ? 's' : ''} completed successfully.`,
      });
      onSaved();
      onClose();
    } else {
      toast({
        variant: 'destructive',
        title: 'Some saves failed',
        description: `${ok} succeeded, ${failed.length} failed: ${failed.join('; ')}`,
      });
    }
  }

  const grouped = useMemo(() => {
    const map = new Map<string, Cell[]>();
    cells.forEach((c) => {
      const list = map.get(c.className) ?? [];
      list.push(c);
      map.set(c.className, list);
    });
    return Array.from(map.entries());
  }, [cells]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && !saving && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>Review &amp; confirm configuration</DialogTitle>
          <DialogDescription>
            {sendable.length} save{sendable.length === 1 ? '' : 's'} will run —
            one per subject, each receiving only the assessment formats that
            subject actually has.
            {skippedCount > 0 &&
              ` ${skippedCount} subject-row${
                skippedCount === 1 ? '' : 's'
              } skipped (no matching format).`}
          </DialogDescription>
        </DialogHeader>

        {!hasMarks || !hasPartitions ? (
          <div className="flex items-center gap-2 rounded-md bg-amber-50 p-3 text-sm text-amber-700">
            <AlertTriangle size={16} />
            Add subject total marks and at least one assessment format before
            saving.
          </div>
        ) : null}

        {warnings.length > 0 && (
          <div className="space-y-1 rounded-md bg-amber-50 p-3 text-sm text-amber-700">
            <p className="flex items-center gap-2 font-medium">
              <AlertTriangle size={16} /> Warnings
            </p>
            <ul className="list-inside list-disc">
              {warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-4">
          {grouped.map(([className, classCells]) => (
            <div key={className}>
              <p className="mb-2 text-sm font-semibold text-gray-800">
                {className}
              </p>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                {classCells.map((cell, i) => {
                  const override = state.overrides[cell.key];
                  const isEditing = editingKey === cell.key;
                  const { applicable, skipped } = formatsForCell(
                    cell,
                    override
                  );
                  return (
                    <div
                      key={cell.key}
                      className={i > 0 ? 'border-t border-gray-100' : ''}
                    >
                      <div className="flex items-center justify-between px-3 py-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium text-gray-800">
                            {cell.subject.name}
                          </span>
                          <span className="text-gray-400">·</span>
                          <span className="text-gray-500">
                            {cell.sectionName}
                          </span>
                          {override ? (
                            <Badge variant="outline" size="xs">
                              Custom
                            </Badge>
                          ) : (
                            <Badge size="xs">Shared</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {override && (
                            <button
                              type="button"
                              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
                              onClick={() =>
                                dispatch({
                                  type: 'CLEAR_OVERRIDE',
                                  key: cell.key,
                                })
                              }
                            >
                              <RotateCcw size={13} /> Reset
                            </button>
                          )}
                          <button
                            type="button"
                            className="flex items-center gap-1 text-xs text-primary hover:underline"
                            onClick={() =>
                              setEditingKey(isEditing ? null : cell.key)
                            }
                          >
                            <Pencil size={13} />
                            {isEditing ? 'Close' : 'Override'}
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-1 px-3 pb-2">
                        {applicable.length === 0 ? (
                          <span className="text-xs italic text-amber-600">
                            No matching format — will be skipped
                          </span>
                        ) : (
                          applicable.map((name) => (
                            <Badge key={name} size="xs">
                              {name}
                            </Badge>
                          ))
                        )}
                        {skipped.map((name) => (
                          <span
                            key={name}
                            className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-400 line-through"
                          >
                            {name}
                          </span>
                        ))}
                      </div>

                      {isEditing && (
                        <OverrideEditor
                          base={
                            override ?? {
                              subjectMarks: state.subjectMarks,
                              partitions: state.partitions,
                            }
                          }
                          formats={
                            lookups.bySubject[cell.subject.subjectId] ?? []
                          }
                          onCancel={() => setEditingKey(null)}
                          onSave={(ov) => {
                            dispatch({
                              type: 'SET_OVERRIDE',
                              key: cell.key,
                              override: ov,
                            });
                            setEditingKey(null);
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <DialogFooter className="flex items-center justify-between gap-3 sm:justify-between">
          <span className="text-sm text-gray-500">
            {saving
              ? `Saving ${progress.done}/${progress.total}…`
              : `${sendable.length} save call${
                  sendable.length === 1 ? '' : 's'
                } ready`}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Back
            </Button>
            <Button onClick={handleConfirm} disabled={!canSave}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Confirm &amp; save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function OverrideEditor({
  base,
  formats,
  onSave,
  onCancel,
}: {
  base: ItemOverride;
  formats: IdName[];
  onSave: (ov: ItemOverride) => void;
  onCancel: () => void;
}) {
  const [marks, setMarks] = useState<SharedSubjectMarks>({
    ...base.subjectMarks,
  });
  const [partitions, setPartitions] = useState<SharedPartition[]>(
    base.partitions.map((p) => ({ ...p }))
  );

  const toggleFormat = (format: IdName) => {
    setPartitions((prev) =>
      prev.some((p) => p.key === format.id)
        ? prev.filter((p) => p.key !== format.id)
        : [...prev, makePartition(format, prev.length + 1)]
    );
  };

  return (
    <div className="space-y-4 border-t border-gray-100 bg-gray-50/60 p-4">
      <MarksRow
        marks={marks}
        onChange={(patch) => setMarks((m) => ({ ...m, ...patch }))}
      />
      <PartitionList
        partitions={partitions}
        formats={formats}
        onToggleFormat={toggleFormat}
        onUpdate={(key, patch) =>
          setPartitions((prev) =>
            prev.map((p) => (p.key === key ? { ...p, ...patch } : p))
          )
        }
        onRemove={(key) =>
          setPartitions((prev) => prev.filter((p) => p.key !== key))
        }
      />
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={() => onSave({ subjectMarks: marks, partitions })}
        >
          Apply override
        </Button>
      </div>
    </div>
  );
}

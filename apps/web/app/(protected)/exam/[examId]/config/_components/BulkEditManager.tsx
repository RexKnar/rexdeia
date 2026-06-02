'use client';

import { useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import {
  EDIT_EXAM_CONFIG_BY_ID,
  EDIT_EXAM_SUBJECT_CONFIG_BY_ID,
  GET_EXAM_CONFIG_SUBJECT_DETAIL_BY_SECTION_IDS,
} from 'lib/endpoints';
import { AlertTriangle, Check, Loader2, Wand2 } from 'lucide-react';
import { useCallback, useMemo, useReducer, useState } from 'react';
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Skeleton,
  Switch,
  useToast,
} from 'ui';

import { useExistingConfigsForScope } from '../_lib/useExistingConfigsForScope';
import { configReducer } from '../_state/configReducer';
import { IdName, initialConfigState } from '../_state/types';
import { Field } from './ConfigFields';
import { ScopeSelector } from './ScopeSelector';

type MarkEdits = { totalMarks: string; convertTo: string; minMark: string };
type PartitionEdit = {
  include: boolean;
  totalMarks: string;
  convertTo: string;
  minMark: string;
  dateToConduct: string;
  order: string;
  setExclude: boolean;
  exclude: boolean;
};

const emptyPartitionEdit: PartitionEdit = {
  include: false,
  totalMarks: '',
  convertTo: '',
  minMark: '',
  dateToConduct: '',
  order: '',
  setExclude: false,
  exclude: false,
};

/** blank string → keep current; otherwise use the new value. */
const pick = (next: string, current: any) =>
  next.trim() === '' ? Number(current) : Number(next);

/** Distinct, non-empty values (stringified) across records. */
const distinct = (vals: any[]) =>
  Array.from(
    new Set(
      vals
        .map((v) =>
          v === null || v === undefined || v === '' ? null : String(v)
        )
        .filter(Boolean) as string[]
    )
  );

/** Shows "Current: X" or an amber "Mixed: a, b" hint under a field. */
function CurrentHint({ values }: { values: string[] }) {
  if (values.length === 0) return null;
  if (values.length === 1)
    return (
      <p className="mt-1 text-[11px] text-gray-400">Current: {values[0]}</p>
    );
  return (
    <p className="mt-1 flex items-center gap-1 text-[11px] text-amber-600">
      <AlertTriangle size={11} /> Mixed: {values.join(', ')}
    </p>
  );
}

export function BulkEditManager({
  examId,
  classList,
  isClassLoading,
}: {
  examId: string;
  classList: IdName[];
  isClassLoading: boolean;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [state, dispatch] = useReducer(configReducer, initialConfigState);

  // Section names aren't needed here (loaded records already carry them), but
  // ScopeSelector requires the callback prop.
  const registerNames = useCallback(() => {}, []);

  const { records, partitionNames, isLoading } = useExistingConfigsForScope(
    state,
    examId
  );

  const [marks, setMarks] = useState<MarkEdits>({
    totalMarks: '',
    convertTo: '',
    minMark: '',
  });
  const [partEdits, setPartEdits] = useState<Record<string, PartitionEdit>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const editFor = (name: string) => partEdits[name] ?? emptyPartitionEdit;
  const patchPart = (name: string, patch: Partial<PartitionEdit>) =>
    setPartEdits((prev) => ({
      ...prev,
      [name]: { ...emptyPartitionEdit, ...prev[name], ...patch },
    }));

  const marksTouched =
    marks.totalMarks !== '' || marks.convertTo !== '' || marks.minMark !== '';

  // Distinct current values across loaded records, so we can show "Current: X"
  // or flag "Mixed: a, b" when records disagree on a field.
  const marksCurrent = useMemo(
    () => ({
      totalMarks: distinct(records.map((r) => r.record?.totalMarks)),
      convertTo: distinct(records.map((r) => r.record?.convertTo)),
      minMark: distinct(records.map((r) => r.record?.minMark)),
    }),
    [records]
  );

  const partCurrent = useMemo(() => {
    const map: Record<string, Record<string, string[]>> = {};
    for (const name of partitionNames) {
      const parts: any[] = [];
      records.forEach((r) =>
        (r.record?.examSubjectPartition ?? []).forEach((p: any) => {
          if (p?.assessmentFormat?.name === name) parts.push(p);
        })
      );
      map[name] = {
        totalMarks: distinct(parts.map((p) => p.totalMarks)),
        convertTo: distinct(parts.map((p) => p.convertTo)),
        minMark: distinct(parts.map((p) => p.minMark)),
        dateToConduct: distinct(
          parts.map((p) => (p.dateToConduct ?? '').split('T')[0])
        ),
        order: distinct(parts.map((p) => p.order)),
        exclude: distinct(
          parts.map((p) => (p.excludeSubjectValidation ? 'Yes' : 'No'))
        ),
      };
    }
    return map;
  }, [records, partitionNames]);

  // True when an edited field has more than one existing value (will be unified).
  const hasMixedEdit = useMemo(() => {
    if (marks.totalMarks !== '' && marksCurrent.totalMarks.length > 1)
      return true;
    if (marks.convertTo !== '' && marksCurrent.convertTo.length > 1)
      return true;
    if (marks.minMark !== '' && marksCurrent.minMark.length > 1) return true;
    for (const name of partitionNames) {
      const e = partEdits[name];
      if (!e?.include) continue;
      const c = partCurrent[name];
      if (!c) continue;
      if (e.totalMarks !== '' && c.totalMarks.length > 1) return true;
      if (e.convertTo !== '' && c.convertTo.length > 1) return true;
      if (e.minMark !== '' && c.minMark.length > 1) return true;
      if (e.dateToConduct !== '' && c.dateToConduct.length > 1) return true;
      if (e.order !== '' && c.order.length > 1) return true;
      if (e.setExclude && c.exclude.length > 1) return true;
    }
    return false;
  }, [marks, marksCurrent, partEdits, partCurrent, partitionNames]);

  // Build the concrete update operations from the bulk form + loaded records.
  const operations = useMemo(() => {
    const ops: {
      kind: 'subject' | 'partition';
      label: string;
      call: () => Promise<unknown>;
    }[] = [];

    for (const { classId, subjectId, record } of records) {
      const sectionId = record?.section?.id ?? '';
      const subjectLabel = `${record?.subjectName ?? ''} · ${record?.section?.name ?? ''}`;

      if (marksTouched && record?.examSubjectId) {
        const payload = {
          totalMarks: pick(marks.totalMarks, record.totalMarks),
          convertTo: pick(marks.convertTo, record.convertTo),
          minMark: pick(marks.minMark, record.minMark),
        };
        ops.push({
          kind: 'subject',
          label: `${subjectLabel} — marks`,
          call: () =>
            makeAPICall(
              EDIT_EXAM_SUBJECT_CONFIG_BY_ID,
              payload,
              {},
              {
                examSubjectId: record.examSubjectId,
              }
            ),
        });
      }

      (record?.examSubjectPartition ?? [])
        .filter((p: any) => p?.assessmentFormat)
        .forEach((p: any) => {
          const edit = partEdits[p.assessmentFormat.name];
          if (!edit?.include) return;
          const fieldsTouched =
            edit.totalMarks !== '' ||
            edit.convertTo !== '' ||
            edit.minMark !== '' ||
            edit.dateToConduct !== '' ||
            edit.order !== '' ||
            edit.setExclude;
          if (!fieldsTouched) return;

          const payload = {
            totalMarks: pick(edit.totalMarks, p.totalMarks),
            convertTo: pick(edit.convertTo, p.convertTo),
            minMark: pick(edit.minMark, p.minMark),
            dateToConduct:
              edit.dateToConduct || (p.dateToConduct ?? '').split('T')[0],
            order: edit.order === '' ? Number(p.order) : Number(edit.order),
            excludeSubjectValidation: edit.setExclude
              ? edit.exclude
              : Boolean(p.excludeSubjectValidation),
          };
          ops.push({
            kind: 'partition',
            label: `${subjectLabel} — ${p.assessmentFormat.name}`,
            call: () =>
              makeAPICall(
                EDIT_EXAM_CONFIG_BY_ID,
                { payload, classId, sectionId, subjectId, configId: p.id },
                {},
                { id: examId, configId: p.id }
              ),
          });
        });
    }
    return ops;
  }, [records, marks, marksTouched, partEdits, examId]);

  const subjectOps = operations.filter((o) => o.kind === 'subject').length;
  const partitionOps = operations.filter((o) => o.kind === 'partition').length;

  async function applyAll() {
    setSaving(true);
    setProgress({ done: 0, total: operations.length });
    let ok = 0;
    let fail = 0;
    for (const op of operations) {
      try {
        await op.call();
        ok += 1;
      } catch {
        fail += 1;
      }
      setProgress({ done: ok + fail, total: operations.length });
    }
    await queryClient.invalidateQueries({
      queryKey: [GET_EXAM_CONFIG_SUBJECT_DETAIL_BY_SECTION_IDS],
    });
    setSaving(false);
    setConfirmOpen(false);

    if (fail === 0) {
      toast({
        title: 'Bulk update applied',
        description: `${ok} update${ok === 1 ? '' : 's'} saved.`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Some updates failed',
        description: `${ok} succeeded, ${fail} failed.`,
      });
    }
  }

  return (
    <div className="space-y-5 pb-24">
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <ScopeSelector
          state={state}
          dispatch={dispatch}
          classList={classList}
          isClassLoading={isClassLoading}
          registerNames={registerNames}
        />
      </div>

      {/* Loaded summary */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        {isLoading ? (
          <Skeleton className="h-6 w-64" />
        ) : (
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span className="font-medium text-gray-800">
              {records.length} configured subject-section
              {records.length === 1 ? '' : 's'} loaded
            </span>
            {partitionNames.length > 0 && (
              <span className="text-gray-400">·</span>
            )}
            {partitionNames.map((n) => (
              <Badge key={n} variant="outline" size="xs">
                {n}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {records.length > 0 && (
        <>
          {/* Subject marks */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="mb-3 text-sm font-semibold text-gray-700">
              Set subject marks{' '}
              <span className="font-normal text-gray-400">
                — leave blank to keep current
              </span>
            </p>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Total marks">
                <Input
                  type="number"
                  value={marks.totalMarks}
                  placeholder={
                    marksCurrent.totalMarks.length === 1
                      ? marksCurrent.totalMarks[0]
                      : 'keep current'
                  }
                  onChange={(e) =>
                    setMarks((m) => ({ ...m, totalMarks: e.target.value }))
                  }
                />
                <CurrentHint values={marksCurrent.totalMarks} />
              </Field>
              <Field label="Convert to">
                <Input
                  type="number"
                  value={marks.convertTo}
                  placeholder={
                    marksCurrent.convertTo.length === 1
                      ? marksCurrent.convertTo[0]
                      : 'keep current'
                  }
                  onChange={(e) =>
                    setMarks((m) => ({ ...m, convertTo: e.target.value }))
                  }
                />
                <CurrentHint values={marksCurrent.convertTo} />
              </Field>
              <Field label="Min pass">
                <Input
                  type="number"
                  value={marks.minMark}
                  placeholder={
                    marksCurrent.minMark.length === 1
                      ? marksCurrent.minMark[0]
                      : 'keep current'
                  }
                  onChange={(e) =>
                    setMarks((m) => ({ ...m, minMark: e.target.value }))
                  }
                />
                <CurrentHint values={marksCurrent.minMark} />
              </Field>
            </div>
          </div>

          {/* Partition edits */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="mb-3 text-sm font-semibold text-gray-700">
              Set partition values{' '}
              <span className="font-normal text-gray-400">
                — tick a partition to include it; blank fields keep current
              </span>
            </p>
            {partitionNames.length === 0 ? (
              <p className="text-sm text-gray-400">
                No partitions found in the selection.
              </p>
            ) : (
              <div className="space-y-3">
                {partitionNames.map((name) => {
                  const edit = editFor(name);
                  return (
                    <div
                      key={name}
                      className={`rounded-lg border p-3 ${
                        edit.include
                          ? 'border-primary/40 bg-primary/5'
                          : 'border-gray-200 bg-gray-50/60'
                      }`}
                    >
                      <label className="mb-2 flex items-center gap-2 font-medium text-gray-800">
                        <input
                          type="checkbox"
                          checked={edit.include}
                          onChange={(e) =>
                            patchPart(name, { include: e.target.checked })
                          }
                        />
                        {name}
                      </label>
                      {edit.include && (
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                          <Field label="Marks to conduct">
                            <Input
                              type="number"
                              value={edit.totalMarks}
                              placeholder={
                                partCurrent[name]?.totalMarks.length === 1
                                  ? partCurrent[name].totalMarks[0]
                                  : 'keep current'
                              }
                              onChange={(e) =>
                                patchPart(name, { totalMarks: e.target.value })
                              }
                            />
                            <CurrentHint
                              values={partCurrent[name]?.totalMarks ?? []}
                            />
                          </Field>
                          <Field label="Convert to">
                            <Input
                              type="number"
                              value={edit.convertTo}
                              placeholder={
                                partCurrent[name]?.convertTo.length === 1
                                  ? partCurrent[name].convertTo[0]
                                  : 'keep current'
                              }
                              onChange={(e) =>
                                patchPart(name, { convertTo: e.target.value })
                              }
                            />
                            <CurrentHint
                              values={partCurrent[name]?.convertTo ?? []}
                            />
                          </Field>
                          <Field label="Min pass">
                            <Input
                              type="number"
                              value={edit.minMark}
                              placeholder={
                                partCurrent[name]?.minMark.length === 1
                                  ? partCurrent[name].minMark[0]
                                  : 'keep current'
                              }
                              onChange={(e) =>
                                patchPart(name, { minMark: e.target.value })
                              }
                            />
                            <CurrentHint
                              values={partCurrent[name]?.minMark ?? []}
                            />
                          </Field>
                          <Field label="Date to conduct">
                            <Input
                              type="date"
                              value={edit.dateToConduct}
                              onChange={(e) =>
                                patchPart(name, {
                                  dateToConduct: e.target.value,
                                })
                              }
                            />
                            <CurrentHint
                              values={partCurrent[name]?.dateToConduct ?? []}
                            />
                          </Field>
                          <Field label="Order">
                            <Input
                              type="number"
                              value={edit.order}
                              placeholder={
                                partCurrent[name]?.order.length === 1
                                  ? partCurrent[name].order[0]
                                  : 'keep current'
                              }
                              onChange={(e) =>
                                patchPart(name, { order: e.target.value })
                              }
                            />
                            <CurrentHint
                              values={partCurrent[name]?.order ?? []}
                            />
                          </Field>
                          <div>
                            <div className="flex items-end gap-2 pb-1">
                              <input
                                type="checkbox"
                                checked={edit.setExclude}
                                onChange={(e) =>
                                  patchPart(name, {
                                    setExclude: e.target.checked,
                                  })
                                }
                              />
                              <span className="text-sm text-gray-600">Set</span>
                              <Switch
                                checked={edit.exclude}
                                disabled={!edit.setExclude}
                                onCheckedChange={(v) =>
                                  patchPart(name, { exclude: Boolean(v) })
                                }
                              />
                              <span className="text-sm text-gray-600">
                                Exclude in pass
                              </span>
                            </div>
                            <CurrentHint
                              values={partCurrent[name]?.exclude ?? []}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {hasMixedEdit && (
            <div className="flex items-start gap-2 rounded-md bg-amber-50 p-3 text-sm text-amber-700">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <span>
                Some fields you&rsquo;re editing currently have{' '}
                <strong>different values</strong> across the selected
                subjects/sections. Applying this edit will overwrite them all to
                the new value.
              </span>
            </div>
          )}
        </>
      )}

      {/* Sticky apply bar */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <span className="text-sm text-gray-600">
            {operations.length} update{operations.length === 1 ? '' : 's'}{' '}
            queued
            {operations.length > 0 &&
              ` (${subjectOps} marks, ${partitionOps} partitions)`}
          </span>
          <Button
            disabled={operations.length === 0 || saving}
            onClick={() => setConfirmOpen(true)}
          >
            <Wand2 className="mr-2 h-4 w-4" /> Apply to all
          </Button>
        </div>
      </div>

      <Dialog
        open={confirmOpen}
        onOpenChange={(v) => !v && !saving && setConfirmOpen(false)}
      >
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Apply bulk changes?</DialogTitle>
            <DialogDescription>
              This will update <strong>{subjectOps}</strong> subject-mark record
              {subjectOps === 1 ? '' : 's'} and <strong>{partitionOps}</strong>{' '}
              partition
              {partitionOps === 1 ? '' : 's'} across your selection. Subjects
              without a selected partition are left untouched.
            </DialogDescription>
          </DialogHeader>
          {operations.length === 0 && (
            <div className="flex items-center gap-2 rounded-md bg-amber-50 p-3 text-sm text-amber-700">
              <AlertTriangle size={16} /> Nothing to update — enter at least one
              value.
            </div>
          )}
          {hasMixedEdit && operations.length > 0 && (
            <div className="flex items-start gap-2 rounded-md bg-amber-50 p-3 text-sm text-amber-700">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <span>
                Heads up: some edited fields currently hold different values —
                they will all be unified to your new value.
              </span>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={applyAll}
              disabled={operations.length === 0 || saving}
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              {saving
                ? `Applying ${progress.done}/${progress.total}…`
                : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

'use client';

import { useUpdateExamSubjectQuery } from 'lib/queries/exams/configuration/subject/useUpdateExamSubjectMutationQuery';
import { useDeleteExamSubjectConfigMutationQuery } from 'lib/queries/exams/configuration/useDeleteExamConfigMutationQuery';
import { useUpdateExamConfigQuery } from 'lib/queries/exams/configuration/useUpdateExamConfigMutationQuery';
import { Check, Loader2, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge, Button, Input, Switch, useToast } from 'ui';

import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';

import { Field } from './ConfigFields';

type PartitionDraft = {
  id: string;
  name: string;
  totalMarks: string;
  convertTo: string;
  minMark: string;
  dateToConduct: string;
  order: string;
  excludeSubjectValidation: boolean;
};

function toPartitionDrafts(config: any): PartitionDraft[] {
  return (config?.examSubjectPartition ?? [])
    .filter((p: any) => p?.assessmentFormat)
    .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
    .map((p: any) => ({
      id: p.id,
      name: p.assessmentFormat?.name ?? '',
      totalMarks: String(p.totalMarks ?? ''),
      convertTo: String(p.convertTo ?? ''),
      minMark: String(p.minMark ?? ''),
      dateToConduct: (p.dateToConduct ?? '').split('T')[0],
      order: String(p.order ?? ''),
      excludeSubjectValidation: Boolean(p.excludeSubjectValidation),
    }));
}

export function EditableSubjectCard({
  examId,
  classId,
  subjectId,
  config,
}: {
  examId: string;
  classId: string;
  subjectId: string;
  config: any;
}) {
  const { toast } = useToast();
  const sectionId: string = config?.section?.id ?? '';

  const { mutateAsync: updateSubject } = useUpdateExamSubjectQuery(
    config?.examSubjectId,
    examId,
    [sectionId],
    subjectId
  );
  const { mutateAsync: updatePartition } = useUpdateExamConfigQuery(examId);
  const { mutateAsync: deletePartition } =
    useDeleteExamSubjectConfigMutationQuery(examId, sectionId, subjectId);

  const [marks, setMarks] = useState({
    totalMarks: String(config?.totalMarks ?? ''),
    convertTo: String(config?.convertTo ?? ''),
    minMark: String(config?.minMark ?? ''),
  });
  const [partitions, setPartitions] = useState<PartitionDraft[]>(
    toPartitionDrafts(config)
  );
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);

  // Re-seed when the underlying config changes (after a refetch).
  useEffect(() => {
    setMarks({
      totalMarks: String(config?.totalMarks ?? ''),
      convertTo: String(config?.convertTo ?? ''),
      minMark: String(config?.minMark ?? ''),
    });
    setPartitions(toPartitionDrafts(config));
  }, [config]);

  const patchPartition = (id: string, patch: Partial<PartitionDraft>) =>
    setPartitions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );

  const saveMarks = async () => {
    setSavingKey('marks');
    try {
      await updateSubject({
        totalMarks: Number(marks.totalMarks),
        convertTo: Number(marks.convertTo),
        minMark: Number(marks.minMark),
      } as any);
      toast({ title: 'Saved', description: 'Subject marks updated.' });
    } catch {
      toast({
        variant: 'destructive',
        title: 'Could not update subject marks',
      });
    } finally {
      setSavingKey(null);
    }
  };

  const savePartition = async (p: PartitionDraft) => {
    setSavingKey(p.id);
    try {
      await updatePartition({
        payload: {
          totalMarks: Number(p.totalMarks),
          convertTo: Number(p.convertTo),
          minMark: Number(p.minMark),
          dateToConduct: p.dateToConduct,
          order: Number(p.order),
          excludeSubjectValidation: p.excludeSubjectValidation,
        },
        classId,
        sectionId,
        subjectId,
        configId: p.id,
      } as any);
      toast({ title: 'Saved', description: `${p.name} updated.` });
    } catch {
      toast({ variant: 'destructive', title: `Could not update ${p.name}` });
    } finally {
      setSavingKey(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePartition(deleteId);
      toast({ title: 'Deleted', description: 'Partition removed.' });
    } catch {
      toast({ variant: 'destructive', title: 'Could not delete partition' });
    } finally {
      setDeleteId(null);
    }
  };

  // Deletes the whole subject configuration by removing each of its partitions
  // (there is no single "delete subject config" endpoint).
  const confirmDeleteAll = async () => {
    setDeletingAll(true);
    let fail = 0;
    for (const p of partitions) {
      try {
        await deletePartition(p.id);
      } catch {
        fail += 1;
      }
    }
    setDeletingAll(false);
    setDeleteAllOpen(false);
    if (fail === 0) {
      toast({
        title: 'Configuration deleted',
        description: `All partitions for ${config?.subjectName ?? 'this subject'} were removed.`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Some partitions could not be deleted',
        description: `${partitions.length - fail} removed, ${fail} failed.`,
      });
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <span className="flex items-center gap-2 font-semibold text-gray-800">
          {config?.subjectName ?? config?.subject?.name}
          <Badge variant="outline" size="xs">
            {config?.section?.name}
          </Badge>
        </span>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setDeleteAllOpen(true)}
          disabled={partitions.length === 0 || deletingAll}
        >
          {deletingAll ? (
            <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="mr-1 h-3.5 w-3.5" />
          )}
          Delete configuration
        </Button>
      </div>

      {/* Subject-level marks */}
      <div className="space-y-3 border-b border-gray-100 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Subject marks
        </p>
        <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-4">
          <Field label="Total marks">
            <Input
              type="number"
              value={marks.totalMarks}
              onChange={(e) =>
                setMarks((m) => ({ ...m, totalMarks: e.target.value }))
              }
            />
          </Field>
          <Field label="Convert to">
            <Input
              type="number"
              value={marks.convertTo}
              onChange={(e) =>
                setMarks((m) => ({ ...m, convertTo: e.target.value }))
              }
            />
          </Field>
          <Field label="Min pass">
            <Input
              type="number"
              value={marks.minMark}
              onChange={(e) =>
                setMarks((m) => ({ ...m, minMark: e.target.value }))
              }
            />
          </Field>
          <Button
            variant="outline"
            onClick={saveMarks}
            disabled={savingKey === 'marks'}
          >
            {savingKey === 'marks' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save marks
          </Button>
        </div>
      </div>

      {/* Partitions */}
      <div className="space-y-3 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Exam partitions
        </p>
        {partitions.length === 0 ? (
          <p className="text-sm text-gray-400">No partitions configured.</p>
        ) : (
          partitions.map((p) => (
            <div
              key={p.id}
              className="rounded-lg border border-gray-200 bg-gray-50/60 p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-gray-800">{p.name}</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => savePartition(p)}
                    disabled={savingKey === p.id}
                  >
                    {savingKey === p.id ? (
                      <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="mr-1 h-3.5 w-3.5" />
                    )}
                    Save
                  </Button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(p.id)}
                    className="text-gray-400 hover:text-red-500"
                    aria-label={`Delete ${p.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                <Field label="Marks to conduct">
                  <Input
                    type="number"
                    value={p.totalMarks}
                    onChange={(e) =>
                      patchPartition(p.id, { totalMarks: e.target.value })
                    }
                  />
                </Field>
                <Field label="Convert to">
                  <Input
                    type="number"
                    value={p.convertTo}
                    onChange={(e) =>
                      patchPartition(p.id, { convertTo: e.target.value })
                    }
                  />
                </Field>
                <Field label="Min pass">
                  <Input
                    type="number"
                    value={p.minMark}
                    onChange={(e) =>
                      patchPartition(p.id, { minMark: e.target.value })
                    }
                  />
                </Field>
                <Field label="Date to conduct">
                  <Input
                    type="date"
                    value={p.dateToConduct}
                    onChange={(e) =>
                      patchPartition(p.id, { dateToConduct: e.target.value })
                    }
                  />
                </Field>
                <Field label="Order">
                  <Input
                    type="number"
                    value={p.order}
                    onChange={(e) =>
                      patchPartition(p.id, { order: e.target.value })
                    }
                  />
                </Field>
                <div className="flex items-end gap-2 pb-1">
                  <Switch
                    checked={p.excludeSubjectValidation}
                    onCheckedChange={(v) =>
                      patchPartition(p.id, {
                        excludeSubjectValidation: Boolean(v),
                      })
                    }
                  />
                  <span className="text-sm text-gray-600">
                    Exclude in pass criteria
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <DeleteConfirmationModal
        open={Boolean(deleteId)}
        description="Are you sure you want to delete this exam partition?"
        onDeleteClick={confirmDelete}
        onCancelClick={() => setDeleteId(null)}
      />

      <DeleteConfirmationModal
        open={deleteAllOpen}
        title="Delete entire configuration?"
        description={`This removes all ${partitions.length} partition(s) configured for ${
          config?.subjectName ?? 'this subject'
        } (${config?.section?.name ?? ''}). This cannot be undone.`}
        onDeleteClick={confirmDeleteAll}
        onCancelClick={() => setDeleteAllOpen(false)}
      />
    </div>
  );
}

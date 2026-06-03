'use client';

import { useGetExamConfigSubjectDetailsBySectionIdsQuery } from 'lib/queries/exams/configuration/subject/useGetExamConfigSubjectDetailsBySectionIdsQuery';
import { useGetExamListQuery } from 'lib/queries/exams/useGetExamListQuery';
import { Copy, Loader2 } from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from 'ui';

import {
  ConfigAction,
  ConfigState,
  SharedPartition,
  SharedSubjectMarks,
} from '../_state/types';

/**
 * Copy the shared config from a PREVIOUS exam.
 *
 * Uses the existing "config by section ids" query for a representative subject
 * from the current selection (e.g. last term's Maths config), then prefills the
 * shared marks + partitions. There is no "whole exam config" endpoint, so we
 * resolve against the first selected class's subject + sections.
 */
export function CopyFromExamDialog({
  open,
  onClose,
  currentExamId,
  state,
  dispatch,
}: {
  open: boolean;
  onClose: () => void;
  currentExamId: string;
  state: ConfigState;
  dispatch: Dispatch<ConfigAction>;
}) {
  const { toast } = useToast();
  const [sourceExamId, setSourceExamId] = useState('');

  const { data: examList } = useGetExamListQuery({ page: 1, limit: 999 });
  const exams = (examList?.data ?? []).filter((e) => e.id !== currentExamId);

  // Representative subject/sections from the current selection.
  const firstClassId = state.selectedClassIds[0];
  const repSections = firstClassId
    ? (state.sectionsByClass[firstClassId] ?? [])
    : [];
  const repSubject = firstClassId
    ? (state.subjectsByClass[firstClassId] ?? [])[0]
    : undefined;

  const { data: sourceConfig, isFetching } =
    useGetExamConfigSubjectDetailsBySectionIdsQuery(
      {
        examId: sourceExamId,
        sectionIds: repSections,
        subjectId: repSubject?.subjectId ?? '',
      },
      {
        enabled:
          open && !!sourceExamId && !!repSubject && repSections.length > 0,
      }
    );

  const preview = useMemo(() => {
    const config = (sourceConfig ?? [])[0];
    if (!config) return null;
    const marks: SharedSubjectMarks = {
      totalMarks: String(config.totalMarks ?? ''),
      convertTo: String(config.convertTo ?? ''),
      minMark: String(config.minMark ?? ''),
    };
    const partitions: SharedPartition[] = (config.examSubjectPartition ?? [])
      .filter((p: any) => p?.assessmentFormat)
      .map((p: any) => ({
        key: p.assessmentFormat.id,
        name: p.assessmentFormat.name,
        assessmentFormatId: p.assessmentFormat.id,
        totalMarks: String(p.totalMarks ?? ''),
        convertTo: String(p.convertTo ?? ''),
        minMark: String(p.minMark ?? ''),
        dateToConduct: (p.dateToConduct ?? '').split('T')[0],
        order: p.order ?? 0,
        excludeSubjectValidation: Boolean(p.excludeSubjectValidation),
      }));
    return { marks, partitions };
  }, [sourceConfig]);

  const noSelection = !repSubject || repSections.length === 0;

  const apply = () => {
    if (!preview) return;
    dispatch({
      type: 'APPLY_TEMPLATE',
      marks: preview.marks,
      partitions: preview.partitions,
    });
    toast({
      title: 'Configuration copied',
      description:
        'Shared config prefilled from the selected exam. Review before saving.',
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle>Copy from a previous exam</DialogTitle>
          <DialogDescription>
            Prefill the shared configuration from an existing exam, using{' '}
            {repSubject ? (
              <strong>{repSubject.name}</strong>
            ) : (
              'your first selected subject'
            )}{' '}
            as the reference.
          </DialogDescription>
        </DialogHeader>

        {noSelection ? (
          <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-700">
            Select at least one class, section and subject first — that subject
            is used to look up the previous configuration.
          </div>
        ) : (
          <div className="space-y-3">
            <Select value={sourceExamId} onValueChange={setSourceExamId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose source exam" />
              </SelectTrigger>
              <SelectContent>
                {exams.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {sourceExamId && (
              <div className="rounded-md border border-gray-200 p-3 text-sm">
                {isFetching ? (
                  <span className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading config…
                  </span>
                ) : preview && preview.partitions.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      Total {preview.marks.totalMarks} · Convert{' '}
                      {preview.marks.convertTo} · Min {preview.marks.minMark}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {preview.partitions.map((p) => (
                        <Badge key={p.key} variant="outline" size="xs">
                          {p.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No saved configuration found for {repSubject?.name} in that
                    exam.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={apply}
            disabled={!preview || preview.partitions.length === 0}
          >
            <Copy className="mr-2 h-4 w-4" /> Copy config
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

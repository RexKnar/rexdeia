'use client';

import { useQueries } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { GET_EXAM_CONFIG_SUBJECT_DETAIL_BY_SECTION_IDS } from 'lib/endpoints';
import { useMemo } from 'react';

import { ConfigState } from '../_state/types';

/** One saved subject-config record, with its owning class id attached. */
export type ScopedConfigRecord = {
  classId: string;
  subjectId: string;
  record: any;
};

/**
 * Loads every existing exam-subject configuration in the current multi-select
 * scope. The detail query is single-subject, so we issue one query per
 * (class → its selected sections, subject) via useQueries and flatten.
 */
export function useExistingConfigsForScope(state: ConfigState, examId: string) {
  const descriptors = useMemo(() => {
    const out: { classId: string; sectionIds: string[]; subjectId: string }[] =
      [];
    for (const classId of state.selectedClassIds) {
      const sectionIds = state.sectionsByClass[classId] ?? [];
      const subjects = state.subjectsByClass[classId] ?? [];
      if (!sectionIds.length) continue;
      for (const subject of subjects) {
        out.push({ classId, sectionIds, subjectId: subject.subjectId });
      }
    }
    return out;
  }, [state.selectedClassIds, state.sectionsByClass, state.subjectsByClass]);

  const results = useQueries({
    queries: descriptors.map((d) => ({
      queryKey: [
        GET_EXAM_CONFIG_SUBJECT_DETAIL_BY_SECTION_IDS,
        examId,
        d.sectionIds,
        d.subjectId,
      ],
      queryFn: () =>
        makeAPICall<any[]>(
          GET_EXAM_CONFIG_SUBJECT_DETAIL_BY_SECTION_IDS,
          { sectionIds: d.sectionIds },
          {},
          { id: examId, subjectId: d.subjectId }
        ),
      enabled: !!examId && !!d.subjectId && d.sectionIds.length > 0,
    })),
  });

  const isLoading = results.some((r) => r.isLoading);

  const records: ScopedConfigRecord[] = useMemo(() => {
    const out: ScopedConfigRecord[] = [];
    results.forEach((r, i) => {
      const d = descriptors[i];
      (r.data ?? []).forEach((record) =>
        out.push({ classId: d.classId, subjectId: d.subjectId, record })
      );
    });
    return out;
  }, [results, descriptors]);

  /** Distinct exam-partition (assessment-format) names across all records. */
  const partitionNames = useMemo(() => {
    const set = new Set<string>();
    records.forEach(({ record }) =>
      (record?.examSubjectPartition ?? []).forEach((p: any) => {
        if (p?.assessmentFormat?.name) set.add(p.assessmentFormat.name);
      })
    );
    return Array.from(set);
  }, [records]);

  return { records, partitionNames, isLoading };
}

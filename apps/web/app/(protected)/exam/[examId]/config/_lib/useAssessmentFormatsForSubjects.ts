'use client';

import { useQueries } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { AssessmentFormatModel } from 'lib/domain/subject';
import { GET_ASSESSMENT_FORMAT_BY_SUBJECT_ID } from 'lib/endpoints';
import { useMemo } from 'react';

import { IdName } from '../_state/types';

/**
 * Fetches assessment formats for every selected subject in parallel and
 * exposes:
 *  - `bySubject`:   subjectId -> formats (used to resolve a shared partition's
 *                   format name back to that subject's own assessmentFormatId).
 *  - `union`:       de-duplicated formats (by name) across all subjects — the
 *                   set the user can toggle in the shared config builder.
 *
 * The per-subject query hook can only take one subject id, so we use
 * `useQueries` to call it once per selected subject without breaking the rules
 * of hooks.
 */
export function useAssessmentFormatsForSubjects(subjectIds: string[]) {
  const uniqueIds = useMemo(
    () => Array.from(new Set(subjectIds.filter(Boolean))),
    [subjectIds]
  );

  const results = useQueries({
    queries: uniqueIds.map((id) => ({
      queryKey: [GET_ASSESSMENT_FORMAT_BY_SUBJECT_ID, id],
      queryFn: () =>
        makeAPICall<AssessmentFormatModel[]>(
          GET_ASSESSMENT_FORMAT_BY_SUBJECT_ID,
          {},
          {},
          { id }
        ),
      enabled: !!id,
    })),
  });

  const isLoading = results.some((r) => r.isLoading);

  const bySubject = useMemo(() => {
    const map: Record<string, IdName[]> = {};
    uniqueIds.forEach((id, i) => {
      const data = results[i]?.data ?? [];
      map[id] = data.map((f) => ({ id: f.id, name: f.name }));
    });
    return map;
  }, [uniqueIds, results]);

  const union = useMemo(() => {
    const byName = new Map<string, IdName>();
    Object.values(bySubject).forEach((formats) => {
      formats.forEach((f) => {
        if (!byName.has(f.name)) byName.set(f.name, f);
      });
    });
    return Array.from(byName.values());
  }, [bySubject]);

  return { union, bySubject, isLoading };
}

'use client';

import { useGetClassListQuery } from 'lib/queries/class/useGetClassListQuery';
import { useGetExamDetailQuery } from 'lib/queries/exams/useGetExamDetailQuery';
import { CalendarDays, ClipboardList, Copy, RotateCcw } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import {
  Badge,
  Button,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'ui';

import { selectionSummary } from '../_lib/buildSaveUnits';
import { useAssessmentFormatsForSubjects } from '../_lib/useAssessmentFormatsForSubjects';
import { configReducer } from '../_state/configReducer';
import { IdName, initialConfigState } from '../_state/types';
import { EditConfigTab } from './EditConfigTab';
import { ReviewConfirmDialog } from './ReviewConfirmDialog';
import { ScopeSelector } from './ScopeSelector';
import { SharedConfigBuilder } from './SharedConfigBuilder';
import { TemplatesMenu } from './TemplatesMenu';

const FILTER = { isActive: true };

export function ExamConfigClient() {
  const examId = useParams<{ examId: string }>().examId;
  const router = useRouter();
  const [state, dispatch] = useReducer(configReducer, initialConfigState);
  const [reviewOpen, setReviewOpen] = useState(false);

  // Section name registry, populated by each class group as its sections load.
  const [sectionNames, setSectionNames] = useState<Record<string, string>>({});

  // Sync state & sectionNames to localStorage
  useEffect(() => {
    localStorage.setItem(
      `exam-config-state-${examId}`,
      JSON.stringify({ state, sectionNames })
    );
  }, [state, sectionNames, examId]);

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`exam-config-state-${examId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.state) dispatch({ type: 'LOAD_STATE', state: parsed.state });
        if (parsed.sectionNames) setSectionNames(parsed.sectionNames);
      } catch (e) {
        console.error('Error loading saved config state:', e);
      }
    }
  }, [examId]);

  const registerNames = useCallback((map: Record<string, string>) => {
    setSectionNames((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const k in map) {
        if (next[k] !== map[k]) {
          next[k] = map[k];
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, []);

  const { data: examDetail, isLoading: examLoading } = useGetExamDetailQuery(
    { examId },
    { enabled: !!examId }
  );

  const { data: classResp, isLoading: classLoading } = useGetClassListQuery({
    page: 1,
    limit: 999,
    filter: FILTER,
  });
  const classList: IdName[] = (classResp?.data ?? []).map((c) => ({
    id: c.id,
    name: c.name,
  }));

  const selectedSubjectIds = useMemo(
    () =>
      Object.values(state.subjectsByClass)
        .flat()
        .map((s) => s.subjectId),
    [state.subjectsByClass]
  );

  const {
    union,
    bySubject,
    isLoading: formatsLoading,
  } = useAssessmentFormatsForSubjects(selectedSubjectIds);

  const lookups = useMemo(
    () => ({
      examId,
      bySubject,
      classNameById: (id: string) =>
        classList.find((c) => c.id === id)?.name ?? id,
      sectionNameById: (id: string) => sectionNames[id] ?? id,
    }),
    [examId, bySubject, classList, sectionNames]
  );

  const summary = selectionSummary(state);
  const canReview = summary.subjects > 0 && summary.sections > 0;

  return (
    <div className="space-y-5 pb-24">
      {/* Exam info + global actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Exam
            </p>
            {examLoading ? (
              <Skeleton className="mt-1 h-5 w-32" />
            ) : (
              <p className="flex items-center gap-2 font-semibold text-gray-800">
                <ClipboardList size={16} className="text-primary" />
                {examDetail?.name ?? '—'}
              </p>
            )}
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Term
            </p>
            {examLoading ? (
              <Skeleton className="mt-1 h-5 w-24" />
            ) : (
              <p className="flex items-center gap-2 font-semibold text-gray-800">
                <CalendarDays size={16} className="text-primary" />
                {examDetail?.term?.name ?? '—'}
              </p>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="add" className="space-y-5">
        <TabsList>
          <TabsTrigger value="add">Add configuration</TabsTrigger>
          <TabsTrigger value="edit">Edit configuration</TabsTrigger>
        </TabsList>

        {/* ---- Add / bulk configure ---- */}
        <TabsContent value="add" className="space-y-5">
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                localStorage.setItem(
                  `exam-config-state-${examId}`,
                  JSON.stringify({ state, sectionNames })
                );
                router.push(`/exam/${examId}/config/copy`);
              }}
            >
              <Copy size={15} className="mr-2" /> Copy from exam
            </Button>
            <TemplatesMenu state={state} dispatch={dispatch} />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch({ type: 'RESET' })}
            >
              <RotateCcw size={15} className="mr-2" /> Reset
            </Button>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <ScopeSelector
              state={state}
              dispatch={dispatch}
              classList={classList}
              isClassLoading={classLoading}
              registerNames={registerNames}
              academicYearId={examDetail?.academicYearId}
            />
          </div>

          <SharedConfigBuilder
            state={state}
            dispatch={dispatch}
            formats={union}
            formatsLoading={formatsLoading && selectedSubjectIds.length > 0}
          />

          {/* Sticky summary / save bar */}
          <div className="fixed inset-x-0 bottom-0 z-10 border-t border-gray-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Badge variant="outline" size="xs">
                  {summary.classes} classes
                </Badge>
                <Badge variant="outline" size="xs">
                  {summary.sections} sections
                </Badge>
                <Badge variant="outline" size="xs">
                  {summary.subjects} subjects
                </Badge>
                {state.partitions.length > 0 && (
                  <Badge size="xs">{state.partitions.length} formats</Badge>
                )}
              </div>
              <Button disabled={!canReview} onClick={() => setReviewOpen(true)}>
                Review &amp; Save
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* ---- Edit existing ---- */}
        <TabsContent value="edit">
          <EditConfigTab
            examId={examId}
            classList={classList}
            isClassLoading={classLoading}
            academicYearId={examDetail?.academicYearId}
          />
        </TabsContent>
      </Tabs>

      {reviewOpen && (
        <ReviewConfirmDialog
          open={reviewOpen}
          onClose={() => setReviewOpen(false)}
          onSaved={() => dispatch({ type: 'RESET' })}
          state={state}
          dispatch={dispatch}
          lookups={lookups}
        />
      )}
    </div>
  );
}

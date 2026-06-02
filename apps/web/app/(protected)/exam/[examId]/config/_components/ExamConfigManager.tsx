'use client';

import { useGetExamConfigSubjectDetailsBySectionIdsQuery } from 'lib/queries/exams/configuration/subject/useGetExamConfigSubjectDetailsBySectionIdsQuery';
import { useGetSubjectsBySectionIdsMutationQuery } from 'lib/queries/section/subjects/useGetSubjectsBySectionIdsQuery';
import { useGetAllSectionByClassIdQuery } from 'lib/queries/section/useGetAllSectionsByClassIdQuery';
import { useGetSubjectTypeList } from 'lib/queries/subject-type/useGetSubjectTypeQuery';
import { Loader2, Pencil } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from 'ui';

import { IdName } from '../_state/types';
import { EditableSubjectCard } from './EditableSubjectCard';

const FILTER = { isActive: true };

export function ExamConfigManager({
  examId,
  classList,
  isClassLoading,
}: {
  examId: string;
  classList: IdName[];
  isClassLoading: boolean;
}) {
  const [classId, setClassId] = useState('');
  const [sectionIds, setSectionIds] = useState<string[]>([]);
  const [subjectTypeId, setSubjectTypeId] = useState('');
  const [subjectId, setSubjectId] = useState('');

  const { data: sectionResp, isLoading: sectionsLoading } =
    useGetAllSectionByClassIdQuery(
      { classId, filter: FILTER },
      { enabled: !!classId }
    );
  const sections: IdName[] = (sectionResp?.data ?? []).map((s) => ({
    id: s.id,
    name: s.name,
  }));

  const { data: subjectTypeResp } = useGetSubjectTypeList({
    page: 1,
    limit: 999,
    filter: FILTER,
  });
  const subjectTypes: IdName[] = (subjectTypeResp?.data ?? []).map((t) => ({
    id: t.id,
    name: t.name,
  }));

  const { data: subjectGroups } = useGetSubjectsBySectionIdsMutationQuery(
    sectionIds,
    subjectTypeId,
    classId,
    { enabled: sectionIds.length > 0 && !!subjectTypeId }
  );
  const subjects: IdName[] = useMemo(
    () =>
      ((subjectGroups as any[]) ?? []).flatMap((g) =>
        (g.subject ?? []).map((s: IdName) => ({ id: s.id, name: s.name }))
      ),
    [subjectGroups]
  );

  const { data: configs, isLoading: configsLoading } =
    useGetExamConfigSubjectDetailsBySectionIdsQuery(
      { examId, sectionIds, subjectId },
      { enabled: sectionIds.length > 0 && !!subjectId }
    );

  const toggleSection = (id: string) => {
    setSubjectId('');
    setSectionIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Pencil size={16} className="text-primary" />
          Find a configured subject to edit
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Class */}
          <div>
            <p className="mb-1 text-xs font-medium text-gray-600">Class</p>
            {isClassLoading ? (
              <Skeleton className="h-9" />
            ) : (
              <Select
                value={classId}
                onValueChange={(v) => {
                  setClassId(v);
                  setSectionIds([]);
                  setSubjectTypeId('');
                  setSubjectId('');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classList.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Sections */}
          <div>
            <p className="mb-1 text-xs font-medium text-gray-600">Sections</p>
            {!classId ? (
              <p className="pt-2 text-sm text-gray-400">Pick a class.</p>
            ) : sectionsLoading ? (
              <Skeleton className="h-9" />
            ) : (
              <div className="flex flex-wrap gap-2 pt-1">
                {sections.map((sec) => {
                  const checked = sectionIds.includes(sec.id);
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => toggleSection(sec.id)}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors ${
                        checked
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-primary/40'
                      }`}
                    >
                      <Checkbox
                        checked={checked}
                        className="pointer-events-none h-3.5 w-3.5"
                      />
                      {sec.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Subject type */}
          <div>
            <p className="mb-1 text-xs font-medium text-gray-600">
              Subject type
            </p>
            <Select
              value={subjectTypeId}
              onValueChange={(v) => {
                setSubjectTypeId(v);
                setSubjectId('');
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {subjectTypes.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject */}
          <div>
            <p className="mb-1 text-xs font-medium text-gray-600">Subject</p>
            <Select
              value={subjectId}
              onValueChange={setSubjectId}
              disabled={!subjectTypeId || sectionIds.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      {!subjectId ? (
        <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-400">
          Select a class, section(s) and subject to load its saved
          configuration.
        </p>
      ) : configsLoading ? (
        <div className="flex items-center justify-center gap-2 p-8 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading configuration…
        </div>
      ) : (configs ?? []).length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-400">
          No saved configuration found for this subject in the selected
          section(s). Add it from the &ldquo;Add configuration&rdquo; tab.
        </p>
      ) : (
        <div className="space-y-4">
          {(configs ?? []).map((config: any) => (
            <EditableSubjectCard
              key={config.id}
              examId={examId}
              classId={classId}
              subjectId={subjectId}
              config={config}
            />
          ))}
        </div>
      )}
    </div>
  );
}

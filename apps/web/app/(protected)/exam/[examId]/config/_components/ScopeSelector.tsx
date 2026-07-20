'use client';

import { useGetSubjectsBySectionIdsMutationQuery } from 'lib/queries/section/subjects/useGetSubjectsBySectionIdsQuery';
import { useGetAllSectionByClassIdQuery } from 'lib/queries/section/useGetAllSectionsByClassIdQuery';
import { useGetSubjectTypeList } from 'lib/queries/subject-type/useGetSubjectTypeQuery';
import { ChevronDown, Layers } from 'lucide-react';
import { Dispatch, useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from 'ui';

import {
  ConfigAction,
  ConfigState,
  IdName,
  SelectedSubject,
} from '../_state/types';

const FILTER = { isActive: true };
const PAGE = 1;
const LIMIT = 999;

type RegisterNames = (sections: Record<string, string>) => void;

export function ScopeSelector({
  state,
  dispatch,
  classList,
  isClassLoading,
  registerNames,
  academicYearId,
}: {
  state: ConfigState;
  dispatch: Dispatch<ConfigAction>;
  classList: IdName[];
  isClassLoading: boolean;
  registerNames: RegisterNames;
  academicYearId?: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <Layers size={16} className="text-primary" />
        Scope — pick the classes, sections &amp; subjects to configure
      </div>

      {isClassLoading ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      ) : classList.length === 0 ? (
        <p className="rounded-md bg-gray-50 p-4 text-sm text-gray-500">
          No classes found.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {classList.map((cls) => {
            const checked = state.selectedClassIds.includes(cls.id);
            return (
              <button
                key={cls.id}
                type="button"
                onClick={() =>
                  dispatch({ type: 'TOGGLE_CLASS', classId: cls.id })
                }
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  checked
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-primary/40'
                }`}
              >
                <Checkbox checked={checked} className="pointer-events-none" />
                {cls.name}
              </button>
            );
          })}
        </div>
      )}

      <div className="space-y-3">
        {state.selectedClassIds.map((classId) => (
          <ClassScopeGroup
            key={classId}
            classId={classId}
            className={classList.find((c) => c.id === classId)?.name ?? classId}
            state={state}
            dispatch={dispatch}
            registerNames={registerNames}
            academicYearId={academicYearId}
          />
        ))}
      </div>
    </div>
  );
}

function ClassScopeGroup({
  classId,
  className,
  state,
  dispatch,
  registerNames,
  academicYearId,
}: {
  classId: string;
  className: string;
  state: ConfigState;
  dispatch: Dispatch<ConfigAction>;
  registerNames: RegisterNames;
  academicYearId?: string;
}) {
  const [open, setOpen] = useState(true);
  const [subjectTypeId, setSubjectTypeId] = useState('');

  const selectedSections = state.sectionsByClass[classId] ?? [];
  const selectedSubjects = state.subjectsByClass[classId] ?? [];

  const { data: sectionResp, isLoading: sectionsLoading } =
    useGetAllSectionByClassIdQuery(
      { classId, filter: { isActive: true, academicYearId } },
      { enabled: !!classId }
    );
  const sections: IdName[] = useMemo(
    () => (sectionResp?.data ?? []).map((s) => ({ id: s.id, name: s.name })),
    [sectionResp]
  );

  // Publish section names upward so the review step can label them.
  useEffect(() => {
    if (sections.length) {
      registerNames(
        sections.reduce<Record<string, string>>((acc, s) => {
          acc[s.id] = s.name;
          return acc;
        }, {})
      );
    }
  }, [sections, registerNames]);

  const { data: subjectTypeResp } = useGetSubjectTypeList({
    page: PAGE,
    limit: LIMIT,
    filter: FILTER,
  });
  const subjectTypes: IdName[] = (subjectTypeResp?.data ?? []).map((t) => ({
    id: t.id,
    name: t.name,
  }));

  const { data: subjectGroups, isLoading: subjectsLoading } =
    useGetSubjectsBySectionIdsMutationQuery(
      selectedSections,
      subjectTypeId,
      classId,
      { enabled: selectedSections.length > 0 && !!subjectTypeId }
    );

  const toggleSubject = (subject: SelectedSubject) =>
    dispatch({ type: 'TOGGLE_SUBJECT', classId, subject });

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 font-semibold text-gray-800">
          {className}
          {selectedSections.length > 0 && (
            <Badge variant="outline" size="xs">
              {selectedSections.length} sec
            </Badge>
          )}
          {selectedSubjects.length > 0 && (
            <Badge size="xs">{selectedSubjects.length} subj</Badge>
          )}
        </span>
        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="grid gap-4 border-t border-gray-100 p-4 md:grid-cols-2">
          {/* Sections */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Sections
              </span>
              {sections.length > 0 && (
                <SelectAllToggle
                  allIds={sections.map((s) => s.id)}
                  selected={selectedSections}
                  onChange={(ids) =>
                    dispatch({
                      type: 'SET_CLASS_SECTIONS',
                      classId,
                      sectionIds: ids,
                    })
                  }
                />
              )}
            </div>
            {sectionsLoading ? (
              <Skeleton className="h-20" />
            ) : sections.length === 0 ? (
              <p className="text-sm text-gray-400">No sections.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {sections.map((sec) => {
                  const checked = selectedSections.includes(sec.id);
                  return (
                    <Pill
                      key={sec.id}
                      checked={checked}
                      label={sec.name}
                      onClick={() =>
                        dispatch({
                          type: 'TOGGLE_SECTION',
                          classId,
                          sectionId: sec.id,
                        })
                      }
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Subjects */}
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Subjects
              </span>
              <Select value={subjectTypeId} onValueChange={setSubjectTypeId}>
                <SelectTrigger className="h-8 w-40">
                  <SelectValue placeholder="Subject type" />
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

            {selectedSections.length === 0 ? (
              <p className="text-sm text-gray-400">Pick a section first.</p>
            ) : !subjectTypeId ? (
              <p className="text-sm text-gray-400">Pick a subject type.</p>
            ) : subjectsLoading ? (
              <Skeleton className="h-20" />
            ) : (
              <div className="space-y-2">
                {((subjectGroups as any[]) ?? []).map((group) => (
                  <div key={group.id}>
                    <p className="mb-1 text-xs font-medium text-gray-500">
                      {group.name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(group.subject ?? []).map((subj: IdName) => {
                        const checked = selectedSubjects.some(
                          (s) => s.subjectId === subj.id
                        );
                        return (
                          <Pill
                            key={subj.id}
                            checked={checked}
                            label={subj.name}
                            onClick={() =>
                              toggleSubject({
                                subjectId: subj.id,
                                groupId: group.id,
                                name: subj.name,
                              })
                            }
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
                {((subjectGroups as any[]) ?? []).length === 0 && (
                  <p className="text-sm text-gray-400">
                    No subjects for this type.
                  </p>
                )}
              </div>
            )}

            {selectedSubjects.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {selectedSubjects.map((s) => (
                  <Badge key={s.subjectId} size="xs">
                    {s.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Pill({
  checked,
  label,
  onClick,
}: {
  checked: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors ${
        checked
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-gray-200 bg-white text-gray-600 hover:border-primary/40'
      }`}
    >
      <Checkbox checked={checked} className="pointer-events-none h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function SelectAllToggle({
  allIds,
  selected,
  onChange,
}: {
  allIds: string[];
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const allSelected =
    allIds.length > 0 && allIds.every((id) => selected.includes(id));
  return (
    <button
      type="button"
      className="text-xs font-medium text-primary hover:underline"
      onClick={() => onChange(allSelected ? [] : allIds)}
    >
      {allSelected ? 'Clear all' : 'Select all'}
    </button>
  );
}

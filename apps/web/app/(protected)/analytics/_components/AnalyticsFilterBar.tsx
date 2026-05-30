'use client';

import { useGetClassListQuery } from 'lib/queries/class/useGetClassListQuery';
import { useGetExamsBySectionIdQuery } from 'lib/queries/exams/useGetExamBySectionIdQuery';
import { useGetAllSectionByClassIdQuery } from 'lib/queries/section/useGetAllSectionsByClassIdQuery';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { SearchableSelect } from '@/components/SearchableSelect';

/**
 * Shared Class → Section → Exam filter for the analytics dashboard. State is
 * stored in the URL so a particular analytics view can be bookmarked / shared
 * and so the summary and detail tabs stay in sync from a single source.
 */
export function AnalyticsFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const classId = searchParams.get('classId');
  const sectionId = searchParams.get('sectionId');
  const examId = searchParams.get('examId');

  const { data: classList, isLoading: isClassLoading } = useGetClassListQuery({
    page: 1,
    limit: 999,
    filter: {},
  });

  const { data: sectionList, isLoading: isSectionLoading } =
    useGetAllSectionByClassIdQuery(
      { filter: {}, classId },
      { enabled: !!classId }
    );

  const { data: examList, isLoading: isExamLoading } =
    useGetExamsBySectionIdQuery(
      sectionId ? { classId, sectionId } : { classId },
      { enabled: !!classId }
    );

  const update = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams);
    mutate(params);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <section className="sticky top-0 z-20 rounded-md border bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SearchableSelect
          label="Class"
          value={classId || ''}
          onChange={(value) =>
            update((params) => {
              params.set('classId', value);
              params.delete('sectionId');
              params.delete('examId');
            })
          }
          options={classList?.data || []}
          placeholder={isClassLoading ? 'Loading...' : 'Select Class'}
          disabled={isClassLoading}
        />

        <SearchableSelect
          label="Section"
          value={sectionId ?? 'all'}
          onChange={(value) =>
            update((params) => {
              value === 'all'
                ? params.delete('sectionId')
                : params.set('sectionId', value);
              params.delete('examId');
            })
          }
          options={[{ id: 'all', name: 'All Sections' }, ...(sectionList?.data || [])]}
          placeholder={isSectionLoading ? 'Loading...' : 'Select Section'}
          disabled={!classId || isSectionLoading}
        />

        <SearchableSelect
          label="Exam"
          value={examId ?? 'all'}
          onChange={(value) =>
            update((params) => {
              value === 'all'
                ? params.delete('examId')
                : params.set('examId', value);
            })
          }
          options={[{ id: 'all', name: 'Choose an Exam' }, ...(examList || [])]}
          placeholder={isExamLoading ? 'Loading...' : 'Select Exam'}
          disabled={!classId || isExamLoading}
        />
      </div>
    </section>
  );
}

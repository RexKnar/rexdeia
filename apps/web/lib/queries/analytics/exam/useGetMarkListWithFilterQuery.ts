import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { StudentsMarksForAnalytics } from 'lib/domain/analytics';
import { EXAM_MARK_LIST_BY_FILTER } from 'lib/endpoints/examAnalyticsEndpoints';

type GetExamAnalyticsFilter = {
  classId?: string;
  sectionId?: string;
  examId?: string;
  pagination: {
    page: number;
    limit: number;
  };
  markRange: any[];
  filterSubjects: any[];
};

function getMarkListWithFilter(
  filter: GetExamAnalyticsFilter,
  options?: Partial<UseQueryOptions<any>>
) {
  return {
    ...options,
    queryKey: [EXAM_MARK_LIST_BY_FILTER, filter],
    queryFn: async () => {
      return await makeAPICall<StudentsMarksForAnalytics[]>(
        EXAM_MARK_LIST_BY_FILTER,
        { ...filter },
        {},
        {}
      );
    },
  };
}

export function useGetMarkListWithFilterQuery(
  filter: GetExamAnalyticsFilter,
  options?: Partial<UseQueryOptions<any>>
) {
  return useQuery(getMarkListWithFilter(filter, options));
}

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { StudentsMarksForAnalytics } from 'lib/domain/analytics';
import { EXAM_MARK_MASTER_BY_FILTER } from 'lib/endpoints/examAnalyticsEndpoints';

type GetMarkAnalyticsFilter = {
  classId?: string;
  sectionId?: string;
  examId?: string;
  pagination: {
    page: number;
    limit: number;
  };
};

function getMarkListWithFilter(
  filter: GetMarkAnalyticsFilter,
  options?: Partial<UseQueryOptions<any>>
) {
  return {
    ...options,
    queryKey: [EXAM_MARK_MASTER_BY_FILTER, filter],
    queryFn: async () => {
      return await makeAPICall<StudentsMarksForAnalytics[]>(
        EXAM_MARK_MASTER_BY_FILTER,
        { ...filter },
        {},
        {}
      );
    },
  };
}

export function useGetMarkMasterWithFilterQuery(
  filter: GetMarkAnalyticsFilter,
  options?: Partial<UseQueryOptions<any>>
) {
  return useQuery(getMarkListWithFilter(filter, options));
}

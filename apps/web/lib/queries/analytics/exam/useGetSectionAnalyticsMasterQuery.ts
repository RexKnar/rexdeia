import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { StudentsMarksForAnalytics } from 'lib/domain/analytics';
import { EXAM_ANALYTICS_SECTION_MASTER } from 'lib/endpoints/examAnalyticsEndpoints';

type GetMarkAnalyticsFilter = {
  classId?: string;
  sectionId?: string;
  examId?: string;
};

function getExamAnalyticsSectionMaster(
  filter: GetMarkAnalyticsFilter,
  options?: Partial<UseQueryOptions<any>>
) {
  return {
    ...options,
    queryKey: [EXAM_ANALYTICS_SECTION_MASTER, filter],
    queryFn: async () => {
      return await makeAPICall<StudentsMarksForAnalytics[]>(
        EXAM_ANALYTICS_SECTION_MASTER,
        { ...filter },
        {},
        {}
      );
    },
  };
}

export function useGetExamAnalyticsSectionMasterQuery(
  filter: GetMarkAnalyticsFilter,
  options?: Partial<UseQueryOptions<any>>
) {
  return useQuery(getExamAnalyticsSectionMaster(filter, options));
}

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { StudentsMarksForAnalytics } from 'lib/domain/analytics';
import { EXAM_ANALYTICS_STAFF_MASTER } from 'lib/endpoints/examAnalyticsEndpoints';

type GetMarkAnalyticsFilter = {
  classId?: string;
  sectionId?: string;
  examId?: string;
};

function getExamAnalyticsStaffMaster(
  filter: GetMarkAnalyticsFilter,
  options?: Partial
) {
  return {
    ...options,
    queryKey: [EXAM_ANALYTICS_STAFF_MASTER, filter],
    queryFn: async () => {
      return await makeAPICall<StudentsMarksForAnalytics[]>(
        EXAM_ANALYTICS_STAFF_MASTER,
        { ...filter },
        {},
        {}
      );
    },
  };
}

export function useGetExamAnalyticsStaffMasterQuery(
  filter: GetMarkAnalyticsFilter,
  options?: Partial
) {
  return useQuery(getExamAnalyticsStaffMaster(filter, options));
}

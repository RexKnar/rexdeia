import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { EXAM_ANALYTICS } from 'lib/endpoints/examAnalyticsEndpoints';

type GetExamAnalyticsFilter = {
  classId?: string;
  sectionId?: string;
  examId?: string;
};
type analyticsResponseModel = {
  analytics: any;
  markList: any[];
  subjectWiseCount: any[];
};

function getExamAnalytics(filter: GetExamAnalyticsFilter, options?: Partial) {
  return {
    ...options,
    queryKey: [EXAM_ANALYTICS, filter.classId, filter.examId],
    queryFn: async () => {
      return await makeAPICall<analyticsResponseModel>(
        EXAM_ANALYTICS,
        { ...filter },
        {},
        {}
      );
    },
  };
}

export function useExamAnalyticsQuery(
  filter: GetExamAnalyticsFilter,
  options?: Partial
) {
  return useQuery(getExamAnalytics(filter, options));
}

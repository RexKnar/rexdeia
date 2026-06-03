import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { GET_EXAM_BRANCH_ANALYTICS } from '../../endpoints';
import { ExamBranchAnalytics } from './types';

export function useExamBranchAnalyticsQuery(
  { examId }: { examId?: string },
  options?: Partial<UseQueryOptions<ExamBranchAnalytics>>
) {
  return useQuery({
    ...options,
    enabled: !!examId && (options?.enabled ?? true),
    queryKey: [GET_EXAM_BRANCH_ANALYTICS, examId],
    queryFn: async () =>
      makeAPICall<ExamBranchAnalytics>(
        GET_EXAM_BRANCH_ANALYTICS,
        {},
        { examId: examId as string },
        {}
      ),
  });
}

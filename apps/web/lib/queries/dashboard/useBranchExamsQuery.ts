import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { GET_BRANCH_EXAMS } from '../../endpoints';
import { BranchExam } from './types';

export function useBranchExamsQuery(
  options?: Partial<UseQueryOptions<BranchExam[]>>
) {
  return useQuery({
    ...options,
    queryKey: [GET_BRANCH_EXAMS],
    queryFn: async () =>
      makeAPICall<BranchExam[]>(GET_BRANCH_EXAMS, {}, {}, {}),
  });
}

import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { ExamModel } from 'lib/domain/exam';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { GET_EXAM_LIST } from '../../endpoints';

function getExamList(
  { page, limit, batchId }: { page: number; limit: number; batchId?: string },
  options?: Partial<UseQueryOptions<PaginatedResponse<ExamModel>>>
): UseQueryOptions<PaginatedResponse<ExamModel>> {
  return {
    ...options,
    queryKey: [GET_EXAM_LIST, page, limit, batchId],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse<ExamModel>>(
        GET_EXAM_LIST,
        {},
        {
          page: page,
          limit: limit,
          ...(batchId && { batchId }),
        },
        {}
      );
    },
  } as UseQueryOptions<PaginatedResponse<ExamModel>>;
}

export function useGetExamListQuery(
  { page, limit, batchId }: { page: number; limit: number; batchId?: string },
  options?: Partial<UseQueryOptions<PaginatedResponse<ExamModel>>>
): UseQueryResult<PaginatedResponse<ExamModel>> {
  return useQuery(getExamList({ page, limit, batchId }, options));
}

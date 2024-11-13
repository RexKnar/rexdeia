import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { ExamTypeModel } from 'lib/domain/exam';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { GET_EXAM_TYPE_LIST } from '../../endpoints';

function getExamTypeList(
  {
    page,
    limit,
    filter,
  }: { page: number; limit: number; filter: { isActive?: boolean } },
  options?: UseQueryOptions
): UseQueryOptions {
  return {
    ...options,
    queryKey: [GET_EXAM_TYPE_LIST, page, limit, filter],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse>(
        GET_EXAM_TYPE_LIST,
        filter,
        {
          page: page,
          limit: limit,
        },
        {}
      );
    },
  };
}

export function useGetExamTypeListQuery(
  {
    page,
    limit,
    filter,
  }: { page: number; limit: number; filter: { isActive?: boolean } },
  options?: UseQueryOptions
): UseQueryResult {
  return useQuery(getExamTypeList({ page, limit, filter }, options));
}

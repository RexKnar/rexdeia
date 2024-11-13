import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { GradeModel } from '../../domain/grade';
import { GET_GRADE_LIST } from '../../endpoints';

function getGradeList(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions
): UseQueryOptions {
  return {
    ...options,
    queryKey: [GET_GRADE_LIST, page, limit],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse>(
        GET_GRADE_LIST,
        {},
        {
          page: page,
          limit: limit,
        },
        {}
      );
    },
  };
}

export function useGetGradeList(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions
): UseQueryResult {
  return useQuery(getGradeList({ page, limit }, options));
}

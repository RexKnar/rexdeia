import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { ClassModel } from '../../domain/class';
import { GET_CLASS } from '../../endpoints';

function getClassList(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions<PaginatedResponse<ClassModel>>
): UseQueryOptions<PaginatedResponse<ClassModel>> {
  return {
    ...options,
    queryKey: [GET_CLASS, page, limit],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse<ClassModel>>(
        GET_CLASS,
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

export function useGetClassListQuery(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions<PaginatedResponse<ClassModel>>
): UseQueryResult<PaginatedResponse<ClassModel>> {
  return useQuery(getClassList({ page, limit }, options));
}

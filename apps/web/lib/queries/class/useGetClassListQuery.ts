import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { ClassModel } from '../../domain/class';
import { GET_CLASS_LIST } from '../../endpoints';

function getClassList(
  {
    page,
    limit,
    filter,
  }: { page: number; limit: number; filter: { isActive?: boolean } },
  options?: UseQueryOptions
): UseQueryOptions {
  return {
    ...options,
    queryKey: [GET_CLASS_LIST, page, limit, filter],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse>(
        GET_CLASS_LIST,
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

export function useGetClassListQuery(
  {
    page,
    limit,
    filter,
  }: { page: number; limit: number; filter: { isActive?: boolean } },
  options?: UseQueryOptions
): UseQueryResult {
  return useQuery(getClassList({ page, limit, filter }, options));
}

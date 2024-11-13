import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { DaysModel } from 'lib/domain/days';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { GET_DAYS_LIST } from '../../endpoints';

function getDaysList(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions
): UseQueryOptions {
  return {
    ...options,
    queryKey: [GET_DAYS_LIST, page, limit],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse>(
        GET_DAYS_LIST,

        {
          page: page,
          limit: limit,
        },
        {}
      );
    },
  };
}

export function useGetDaysListQuery(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions
): UseQueryResult {
  return useQuery(getDaysList({ page, limit }, options));
}

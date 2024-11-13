import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { GET_PERIOD_MASTERS_LIST } from 'lib/endpoints';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { PeriodMasterModel } from '../../domain/periodMaster';

function getPeriodMasterList(
  {
    page,
    limit,
  }: {
    page: number;
    limit: number;
  },
  options?: UseQueryOptions
): UseQueryOptions {
  return {
    ...options,
    queryKey: [GET_PERIOD_MASTERS_LIST, page, limit],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse>(
        GET_PERIOD_MASTERS_LIST,
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

export function useGetPeriodMasterListQuery(
  {
    page,
    limit,
  }: {
    page: number;
    limit: number;
  },
  options?: UseQueryOptions
): UseQueryResult {
  return useQuery(getPeriodMasterList({ page, limit }, options));
}

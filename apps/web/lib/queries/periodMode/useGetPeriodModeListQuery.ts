import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { PeriodModeModel } from 'lib/domain/periodMode';

import { makeAPICall } from '../../api';
import { GET_PERIOD_MODE_LIST } from '../../endpoints';

function getPeriodModeList(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions<PeriodModeModel[]>
): UseQueryOptions<PeriodModeModel[]> {
  return {
    ...options,
    queryKey: [GET_PERIOD_MODE_LIST, page, limit],
    queryFn: async () => {
      return await makeAPICall<PeriodModeModel[]>(
        GET_PERIOD_MODE_LIST,
        {
          page: page,
          limit: limit,
        },
        {}
      );
    },
  };
}

export function useGetPeriodModeListQuery(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions<PeriodModeModel[]>
): UseQueryResult<PeriodModeModel[]> {
  return useQuery(getPeriodModeList({ page, limit }, options));
}

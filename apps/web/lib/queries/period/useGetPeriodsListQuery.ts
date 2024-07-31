import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { PeriodModel } from 'lib/domain/period';

import { makeAPICall } from '../../api';
import { GET_PERIODS_LIST } from '../../endpoints';

function getPeriodsList(
  page: number,
  limit: number,
  options?: Partial<UseQueryOptions<PeriodModel>>
): UseQueryOptions<PeriodModel> {
  return {
    ...options,
    queryKey: [GET_PERIODS_LIST, page, limit],
    queryFn: async () => {
      return await makeAPICall<PeriodModel>(
        GET_PERIODS_LIST,
        {
          page: page,
          limit: limit,
        },
        {},
        {}
      );
    },
  };
}
export function useGetPeriodsListQuery(
  page: number,
  limit: number,
  options?: Partial<UseQueryOptions<PeriodModel>>
): UseQueryResult<PeriodModel> {
  return useQuery(getPeriodsList(page, limit, options));
}

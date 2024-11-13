import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { PeriodTypeModel } from 'lib/domain/periodsType';

import { makeAPICall } from '../../api';
import { GET_PERIOD_TYPES_LIST } from '../../endpoints';

function getPeriodTypeList(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions
): UseQueryOptions {
  return {
    ...options,
    queryKey: [GET_PERIOD_TYPES_LIST, page, limit],
    queryFn: async () => {
      return await makeAPICall<PeriodTypeModel[]>(
        GET_PERIOD_TYPES_LIST,

        {
          page: page,
          limit: limit,
        },
        {}
      );
    },
  };
}

export function useGetPeriodTypeListQuery(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions
): UseQueryResult {
  return useQuery(getPeriodTypeList({ page, limit }, options));
}

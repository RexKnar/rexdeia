import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { PeriodTypeModel } from 'lib/domain/periodsType';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { GET_PERIOD_TYPES_LIST } from '../../endpoints';

function getPeriodTypeList(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions<PaginatedResponse<PeriodTypeModel>>
): UseQueryOptions<PaginatedResponse<PeriodTypeModel>> {
  return {
    ...options,
    queryKey: [GET_PERIOD_TYPES_LIST, page, limit],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse<PeriodTypeModel>>(
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
  options?: UseQueryOptions<PaginatedResponse<PeriodTypeModel>>
): UseQueryResult<PaginatedResponse<PeriodTypeModel>> {
  return useQuery(getPeriodTypeList({ page, limit }, options));
}

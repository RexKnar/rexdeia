import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { PeriodModel } from 'lib/domain/period';

import { makeAPICall } from '../../api';
import { GET_PERIODS_LIST } from '../../endpoints';

function getPeriodsList(options?: Partial): UseQueryOptions {
  return {
    ...options,
    queryKey: [GET_PERIODS_LIST],
    queryFn: async () => {
      return await makeAPICall<PeriodModel[]>(GET_PERIODS_LIST, {}, {}, {});
    },
  };
}
export function useGetPeriodsListQuery(options?: Partial): UseQueryResult {
  return useQuery(getPeriodsList(options));
}

import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { PeriodModel } from 'lib/domain/period';

import { makeAPICall } from '../../api';
import { GET_PERIOD_BY_ID } from '../../endpoints';

function getPeriodById(
  Id: string,
  options?: Partial<UseQueryOptions<PeriodModel>>
): UseQueryOptions<PeriodModel> {
  return {
    ...options,
    queryKey: [GET_PERIOD_BY_ID, Id],
    queryFn: async () => {
      return await makeAPICall<PeriodModel>(GET_PERIOD_BY_ID, {}, {}, { Id });
    },
  };
}
export function useGetPeriodByIdQuery(
  id: string,
  options?: Partial<UseQueryOptions<PeriodModel>>
): UseQueryResult<PeriodModel> {
  return useQuery(getPeriodById(id, options));
}

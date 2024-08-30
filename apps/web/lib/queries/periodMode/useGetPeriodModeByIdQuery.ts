import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { PeriodTypeModel } from 'lib/domain/periodsType';

import { makeAPICall } from '../../api';
import { GET_PERIOD_MODE_BY_ID } from '../../endpoints';

function getPeriodModeById(
  Id: string,
  options?: Partial<UseQueryOptions<PeriodTypeModel>>
): UseQueryOptions<PeriodTypeModel> {
  return {
    ...options,
    queryKey: [GET_PERIOD_MODE_BY_ID, Id],
    queryFn: async () => {
      return await makeAPICall<PeriodTypeModel>(
        GET_PERIOD_MODE_BY_ID,
        {},
        {},
        { Id }
      );
    },
  };
}
export function useGetPeriodModeByIdQuery(
  id: string,
  options?: Partial<UseQueryOptions<PeriodTypeModel>>
): UseQueryResult<PeriodTypeModel> {
  return useQuery(getPeriodModeById(id, options));
}

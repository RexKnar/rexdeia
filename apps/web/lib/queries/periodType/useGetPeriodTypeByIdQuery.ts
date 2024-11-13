import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { PeriodTypeModel } from 'lib/domain/periodsType';

import { makeAPICall } from '../../api';
import { GET_PERIOD_TYPE_BY_ID } from '../../endpoints';

function getPeriodTypeById(id: string, options?: Partial): UseQueryOptions {
  return {
    ...options,
    queryKey: [GET_PERIOD_TYPE_BY_ID, id],
    queryFn: async () => {
      return await makeAPICall<PeriodTypeModel>(
        GET_PERIOD_TYPE_BY_ID,
        {},
        {},
        { id }
      );
    },
  };
}
export function useGetPeriodTypeByIdQuery(
  id: string,
  options?: Partial
): UseQueryResult {
  return useQuery(getPeriodTypeById(id, options));
}

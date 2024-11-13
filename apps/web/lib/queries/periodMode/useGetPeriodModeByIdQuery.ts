import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { PeriodModeModel } from 'lib/domain/periodMode';

import { makeAPICall } from '../../api';
import { GET_PERIOD_MODE_BY_ID } from '../../endpoints';

function getPeriodModeById(id: string, options?: Partial): UseQueryOptions {
  return {
    ...options,
    queryKey: [GET_PERIOD_MODE_BY_ID, id],
    queryFn: async () => {
      return await makeAPICall<PeriodModeModel>(
        GET_PERIOD_MODE_BY_ID,
        {},
        {},
        { id }
      );
    },
  };
}
export function useGetPeriodModeByIdQuery(
  id: string,
  options?: Partial
): UseQueryResult {
  return useQuery(getPeriodModeById(id, options));
}

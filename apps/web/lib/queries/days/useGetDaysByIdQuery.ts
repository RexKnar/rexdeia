import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { DaysModel } from 'lib/domain/days';

import { makeAPICall } from '../../api';
import { GET_DAYS_BY_ID } from '../../endpoints';

function getDaysById(Id: string, options?: Partial): UseQueryOptions {
  return {
    ...options,
    queryKey: [GET_DAYS_BY_ID, Id],
    queryFn: async () => {
      return await makeAPICall<DaysModel>(GET_DAYS_BY_ID, {}, {}, { Id });
    },
  };
}
export function useGetDaysByIdQuery(
  id: string,
  options?: Partial
): UseQueryResult {
  return useQuery(getDaysById(id, options));
}

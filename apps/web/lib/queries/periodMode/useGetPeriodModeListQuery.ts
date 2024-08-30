import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { PeriodModeModel } from 'lib/domain/periodMode';

import { makeAPICall } from '../../api';
import { GET_PERIOD_TYPES_LIST } from '../../endpoints';

function getPeriodModeList(
  options?: UseQueryOptions<PeriodModeModel>
): UseQueryOptions<PeriodModeModel> {
  return {
    ...options,
    queryKey: [GET_PERIOD_TYPES_LIST],
    queryFn: async () => {
      return await makeAPICall<PeriodModeModel>(GET_PERIOD_TYPES_LIST, {}, {});
    },
  };
}

export function useGetPeriodModeListQuery(
  options?: UseQueryOptions<PeriodModeModel>
): UseQueryResult<PeriodModeModel> {
  return useQuery(getPeriodModeList(options));
}

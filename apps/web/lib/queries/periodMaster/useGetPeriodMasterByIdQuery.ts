import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { PeriodMasterModel } from 'lib/domain/periodMaster';

import { makeAPICall } from '../../api';
import { GET_PERIOD_MASTER_BY_ID } from '../../endpoints';

function getPeriodMasterById(
  Id: string,
  options?: Partial<UseQueryOptions<PeriodMasterModel>>
): UseQueryOptions<PeriodMasterModel> {
  return {
    ...options,
    queryKey: [GET_PERIOD_MASTER_BY_ID, Id],
    queryFn: async () => {
      return await makeAPICall<PeriodMasterModel>(
        GET_PERIOD_MASTER_BY_ID,
        {},
        {},
        { Id }
      );
    },
  };
}
export function useGetPeriodMasterByIdQuery(
  id: string,
  options?: Partial<UseQueryOptions<PeriodMasterModel>>
): UseQueryResult<PeriodMasterModel> {
  return useQuery(getPeriodMasterById(id, options));
}

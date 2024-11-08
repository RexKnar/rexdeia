import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  PeriodMasterModel,
  UpdatePeriodMasterModel,
} from 'lib/domain/periodMaster';

import { makeAPICall } from '../../api';
import {
  GET_PERIOD_MASTERS_LIST,
  UPDATE_PERIOD_MASTER_BY_ID,
} from '../../endpoints';

export function useUpdatePeriodMasterMutationQuery(
  page: number,
  limit: number
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdatePeriodMasterModel) => {
      const response = await makeAPICall<PeriodMasterModel>(
        UPDATE_PERIOD_MASTER_BY_ID,
        payload,
        {},
        { id: payload.id }
      );

      await queryClient.refetchQueries({
        queryKey: [GET_PERIOD_MASTERS_LIST, page, limit],
      });

      return response;
    },
  });
}

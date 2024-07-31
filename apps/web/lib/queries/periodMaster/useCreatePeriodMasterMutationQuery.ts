import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CreatePeriodMasterModel,
  PeriodMasterModel,
} from 'lib/domain/periodMaster';
import { ADD_PERIOD_MASTER, GET_PERIOD_MASTERS_LIST } from 'lib/endpoints';

import { makeAPICall } from '../../api';

export function useCreatePeriodMasterMutationQuery(
  page: number,
  limit: number
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePeriodMasterModel) => {
      const response = await makeAPICall<PeriodMasterModel>(
        ADD_PERIOD_MASTER,
        payload,
        {},
        {}
      );
      await queryClient.refetchQueries({
        queryKey: [GET_PERIOD_MASTERS_LIST, page, limit],
      });

      return response;
    },
  });
}

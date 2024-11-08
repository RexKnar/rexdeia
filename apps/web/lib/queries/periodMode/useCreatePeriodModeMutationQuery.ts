import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreatePeriodModeModel } from 'lib/domain/periodMode';
import { ADD_PERIOD_MODE, GET_PERIOD_MODE_LIST } from 'lib/endpoints';

import { makeAPICall } from '../../api';

export function useCreatePeriodModeMutationQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreatePeriodModeModel) => {
      const response = await makeAPICall<CreatePeriodModeModel>(
        ADD_PERIOD_MODE,
        payload,
        {},
        {}
      );
      await queryClient.invalidateQueries({
        queryKey: [GET_PERIOD_MODE_LIST],
      });
      return response;
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_PERIOD_MODE_LIST],
      });
    },
  });
}

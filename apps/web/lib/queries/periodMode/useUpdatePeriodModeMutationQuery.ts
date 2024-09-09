import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PeriodModeModel, UpdatePeriodModeModel } from 'lib/domain/periodMode';
import { GET_PERIOD_MODE_LIST, UPDATE_PERIOD_MODE_BY_ID } from 'lib/endpoints';

import { makeAPICall } from '../../api';

export function useUpdatePeriodModeMutationQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdatePeriodModeModel) => {
      const response = await makeAPICall<PeriodModeModel>(
        UPDATE_PERIOD_MODE_BY_ID,
        payload,
        {},
        { id: payload.id }
      );
      await queryClient.refetchQueries({
        queryKey: [GET_PERIOD_MODE_LIST],
      });

      return response;
    },
  });
}

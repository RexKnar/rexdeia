import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PeriodModel } from 'lib/domain/period';

import { makeAPICall } from '../../api';
import { GET_PERIODS_LIST, UPDATE_PERIOD_BY_ID } from '../../endpoints';

export function useUpdatePeriodMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: PeriodModel) => {
      const response = await makeAPICall<PeriodModel>(
        UPDATE_PERIOD_BY_ID,
        payload,
        {},
        {}
      );

      await queryClient.refetchQueries({
        queryKey: [GET_PERIODS_LIST, page, limit],
      });

      return response;
    },
  });
}

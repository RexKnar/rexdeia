import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PeriodModel } from 'lib/domain/period';

import { makeAPICall } from '../../api';
import { DELETE_PERIOD_BY_ID, GET_PERIODS_LIST } from '../../endpoints';

export function useDeletePeriodMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: PeriodModel) => {
      const response = await makeAPICall<PeriodModel>(
        DELETE_PERIOD_BY_ID,
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

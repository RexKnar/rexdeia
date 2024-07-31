import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreatePeriodModel, PeriodModel } from 'lib/domain/period';

import { makeAPICall } from '../../api';
import { ADD_PERIOD, GET_PERIODS_LIST } from '../../endpoints';

export function useCreatePeriodMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePeriodModel) => {
      const response = await makeAPICall<PeriodModel>(
        ADD_PERIOD,
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

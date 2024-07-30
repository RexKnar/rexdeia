import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateDaysModel, DaysModel } from 'lib/domain/days';
import { ADD_DAYS, GET_DAYS_LIST } from 'lib/endpoints';

import { makeAPICall } from '../../api';

export function useCreateDaysMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateDaysModel) => {
      const response = await makeAPICall<DaysModel>(ADD_DAYS, payload, {}, {});
      await queryClient.refetchQueries({
        queryKey: [GET_DAYS_LIST, page, limit],
      });

      return response;
    },
  });
}

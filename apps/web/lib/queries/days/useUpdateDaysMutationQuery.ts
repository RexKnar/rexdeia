import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DaysModel, UpdateDaysModel } from 'lib/domain/days';

import { makeAPICall } from '../../api';
import { GET_DAYS_LIST, UPDATE_DAYS_BY_ID } from '../../endpoints';

export function useUpdateDaysMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateDaysModel) => {
      const response = await makeAPICall<DaysModel>(
        UPDATE_DAYS_BY_ID,
        payload,
        {},
        { id: payload.id }
      );

      await queryClient.refetchQueries({
        queryKey: [GET_DAYS_LIST, page, limit],
      });

      return response;
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DELETE_DAYS_BY_ID, GET_DAYS_LIST } from 'lib/endpoints';

import { makeAPICall } from '../../api';

export function useDeleteDaysMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await makeAPICall<unknown>(
        DELETE_DAYS_BY_ID,
        {},
        {},
        { id }
      );
      await queryClient.refetchQueries({
        queryKey: [GET_DAYS_LIST, page, limit],
      });

      return response;
    },
  });
}

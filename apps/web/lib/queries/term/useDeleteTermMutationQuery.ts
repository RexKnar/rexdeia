import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { DELETE_TERM_BY_ID, GET_TERM_LIST } from 'lib/endpoints';

export function useDeleteTermMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await makeAPICall<unknown>(
        DELETE_TERM_BY_ID,
        {},
        {},
        { id }
      );
      await queryClient.refetchQueries({
        queryKey: [GET_TERM_LIST, page, limit],
      });

      return response;
    },
  });
}
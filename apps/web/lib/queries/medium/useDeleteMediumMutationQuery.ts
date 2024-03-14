import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { DELETE_MEDIUM_BY_ID, GET_MEDIUM_LIST } from '../../endpoints';

export function useDeleteMediumMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await makeAPICall<unknown>(
        DELETE_MEDIUM_BY_ID,
        {},
        {},
        { id }
      );
      await queryClient.refetchQueries({
        queryKey: [GET_MEDIUM_LIST, page, limit],
      });

      return response;
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { DELETE_CLASSLEVEL_BY_ID, GET_CLASSLEVELS_LIST } from '../../endpoints';

export function useDeleteClassLevelMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await makeAPICall<unknown>(
        DELETE_CLASSLEVEL_BY_ID,
        {},
        {},
        { id }
      );
      await queryClient.refetchQueries({
        queryKey: [GET_CLASSLEVELS_LIST, page, limit],
      });

      return response;
    },
  });
}

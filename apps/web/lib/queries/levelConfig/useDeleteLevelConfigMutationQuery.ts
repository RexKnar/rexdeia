import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import {
  DELETE_LEVELCONFIG_BY_ID,
  GET_LEVELCONFIG_LIST,
} from '../../endpoints';

export function useDeleteLevelConfigMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await makeAPICall<unknown>(
        DELETE_LEVELCONFIG_BY_ID,
        {},
        {},
        { id }
      );
      await queryClient.refetchQueries({
        queryKey: [GET_LEVELCONFIG_LIST, page, limit],
      });

      return response;
    },
  });
}

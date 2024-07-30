import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import {
  DELETE_PERIOD_TYPE_BY_ID,
  GET_PERIOD_TYPES_LIST,
} from '../../endpoints';

export function useDeletePeriodTypelMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await makeAPICall<unknown>(
        DELETE_PERIOD_TYPE_BY_ID,
        {},
        {},
        { id }
      );
      await queryClient.refetchQueries({
        queryKey: [GET_PERIOD_TYPES_LIST, page, limit],
      });

      return response;
    },
  });
}

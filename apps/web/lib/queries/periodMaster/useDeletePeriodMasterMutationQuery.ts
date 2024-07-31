import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';

import {
  DELETE_PERIOD_MASTER_BY_ID,
  GET_PERIOD_MASTERS_LIST,
} from '../../endpoints';

export function useDeletePeriodMasterMutationQuery(
  page: number,
  limit: number
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await makeAPICall<unknown>(
        DELETE_PERIOD_MASTER_BY_ID,
        {},
        {},
        { id }
      );
      await queryClient.refetchQueries({
        queryKey: [GET_PERIOD_MASTERS_LIST, page, limit],
      });

      return response;
    },
  });
}

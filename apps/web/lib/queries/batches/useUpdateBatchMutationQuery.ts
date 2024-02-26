import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { BatchModel, UpdateBatchModel } from '../../domain/batch';
import { GET_BATCHES_LIST, UPDATE_BATCH_BY_ID } from '../../endpoints';

export function useUpdateBatchMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateBatchModel) => {
      const response = await makeAPICall<BatchModel>(
        UPDATE_BATCH_BY_ID,
        payload,
        {},
        { id: payload.id }
      );

      await queryClient.refetchQueries({
        queryKey: [GET_BATCHES_LIST, page, limit],
      });

      return response;
    },
  });
}

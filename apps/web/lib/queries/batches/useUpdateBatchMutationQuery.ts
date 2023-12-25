import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { BatchModel, UpdateBatchModel } from '../../domain/batch';
import { GET_BATCHES_LIST, UPDATE_BATCH_BY_ID } from '../../endpoints';

export function useUpdateBatchMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateBatchModel) => {
      return await makeAPICall<BatchModel>(
        UPDATE_BATCH_BY_ID,
        payload,
        {},
        { id: payload.id }
      );
    },
    onMutate: async (payload: UpdateBatchModel) => {
      await queryClient.cancelQueries({
        queryKey: [GET_BATCHES_LIST, page, limit],
      });

      const previousBatches = queryClient.getQueryData<
        PaginatedResponse<BatchModel>
      >([GET_BATCHES_LIST, page, limit]);

      queryClient.setQueryData(
        [GET_BATCHES_LIST, page, limit],
        (existingBatches: PaginatedResponse<BatchModel>) => {
          return {
            ...existingBatches,
            data: [
              ...existingBatches.data.map((batch) => {
                if (batch.id === payload.id) {
                  return { ...payload, isUpdating: true };
                }
                return batch;
              }),
            ],
          };
        }
      );

      return { previousBatches };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData([GET_BATCHES_LIST], context.previousBatches);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_BATCHES_LIST, page, limit],
      });
    },
  });
}

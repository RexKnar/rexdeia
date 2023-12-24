import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { BatchModel } from '../../domain/batch';
import { DELETE_BATCH_BY_ID, GET_BATCHES_LIST } from '../../endpoints';

export function useDeleteBatchMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      return await makeAPICall<unknown>(DELETE_BATCH_BY_ID, {}, {}, { id });
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: [GET_BATCHES_LIST, page, limit],
      });

      const previousBatches = queryClient.getQueryData<
        PaginatedResponse<BatchModel>
      >([GET_BATCHES_LIST, page, limit]);

      queryClient.setQueryData(
        [GET_BATCHES_LIST, page, limit],
        (currentPaginatedBatches: PaginatedResponse<BatchModel>) => {
          return {
            ...currentPaginatedBatches,
            data: currentPaginatedBatches.data.map((batch) => {
              if (batch.id !== id) {
                return batch;
              } else {
                return {
                  ...batch,
                  isDeleting: true,
                };
              }
            }),
          };
        }
      );

      return { previousBatches: previousBatches };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(
        [GET_BATCHES_LIST, page, limit],
        context.previousBatches
      );
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_BATCHES_LIST, page, limit],
      });
    },
  });
}

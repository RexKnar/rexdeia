import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { BatchModel, CreateBatchModel } from '../../domain/batch';
import { RegulationModel } from '../../domain/regulation';
import { CREATE_BATCH, GET_BATCHES_LIST } from '../../endpoints';

export function useCreateBatchMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateBatchModel) => {
      return await makeAPICall<BatchModel>(CREATE_BATCH, payload, {}, {});
    },
    onMutate: async (payload: CreateBatchModel) => {
      await queryClient.cancelQueries({
        queryKey: [GET_BATCHES_LIST, page, limit],
      });

      const previousBatches = queryClient.getQueryData<
        PaginatedResponse<RegulationModel>
      >([GET_BATCHES_LIST, page, limit]);

      queryClient.setQueryData(
        [GET_BATCHES_LIST, page, limit],
        (existingRegulations: PaginatedResponse<RegulationModel>) => {
          return {
            ...existingRegulations,
            data: [
              ...existingRegulations.data,
              { ...payload, isNewlyAdded: true, status: true },
            ],
          };
        }
      );

      return { previousRegulations: previousBatches };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData([GET_BATCHES_LIST], context.previousRegulations);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_BATCHES_LIST, page, limit],
      });
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { BatchModel, CreateBatchModel } from '../../domain/batch';
import { CREATE_BATCH, GET_BATCHES_LIST } from '../../endpoints';

export function useCreateBatchMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateBatchModel) => {
      const response = await makeAPICall<BatchModel>(
        CREATE_BATCH,
        payload,
        {},
        {}
      );
      await queryClient.refetchQueries({
        queryKey: [GET_BATCHES_LIST, page, limit],
      });

      return response;
    },
  });
}

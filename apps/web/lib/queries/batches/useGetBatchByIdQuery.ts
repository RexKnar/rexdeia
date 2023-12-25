import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { BatchModel } from '../../domain/batch';
import { GET_BATCH_BY_ID } from '../../endpoints';
import { makeAPICall } from '../../api';

function getBatchById(
  id: string,
  options?: Partial<UseQueryOptions<BatchModel>>
) {
  return {
    ...options,
    queryKey: [GET_BATCH_BY_ID, id],
    queryFn: async () => {
      return await makeAPICall<BatchModel>(GET_BATCH_BY_ID, {}, {}, { id });
    },
  };
}

export function useGetBatchByIdQuery(
  id: string,
  options?: Partial<UseQueryOptions<BatchModel>>
) {
  return useQuery(getBatchById(id, options));
}

export function usePrefetchBatch() {
  const queryClient = useQueryClient();

  const prefetchBatchById = async (id: string) => {
    await queryClient.prefetchQuery(getBatchById(id));
  };

  return {
    prefetchBatchById,
  };
}

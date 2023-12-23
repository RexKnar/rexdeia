import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { GET_BATCHES_LIST } from '../../endpoints';
import { BatchModel } from '../../domain/batch';

function getBatchesList(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions<PaginatedResponse<BatchModel>>
): UseQueryOptions<PaginatedResponse<BatchModel>> {
  return {
    ...options,
    queryKey: [GET_BATCHES_LIST, page, limit],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse<BatchModel>>(
        GET_BATCHES_LIST,
        {},
        {
          page: page,
          limit: limit,
        },
        {}
      );
    },
  };
}

export function useGetBatchesListQuery(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions<PaginatedResponse<BatchModel>>
): UseQueryResult<PaginatedResponse<BatchModel>> {
  return useQuery(getBatchesList({ page, limit }, options));
}

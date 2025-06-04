import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { BatchModel } from '../../domain/batch';
import { GET_BATCHES_LIST } from '../../endpoints';

function getBatchesList(
  {
    page,
    limit,
    filter,
  }: { page: number; limit: number; filter: { isActive?: boolean } },
  options?: UseQueryOptions<PaginatedResponse<BatchModel>>
): UseQueryOptions<PaginatedResponse<BatchModel>> {
  return {
    ...options,
    queryKey: [GET_BATCHES_LIST, page, limit, filter],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse<BatchModel>>(
        GET_BATCHES_LIST,
        filter,
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
  {
    page,
    limit,
    filter,
  }: {
    page: number;
    limit: number;
    filter: { isActive?: boolean; currentAcademicYear?: boolean };
  },
  options?: UseQueryOptions<PaginatedResponse<BatchModel>>
) {
  const response = useQuery(getBatchesList({ page, limit, filter }, options));

  const batches = response.data?.data.flatMap((batch) => batch) ?? [];

  return {
    ...response,
    batches: batches,
  };
}

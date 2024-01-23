import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { MediumModel } from '../../domain/medium';
import { GET_MEDIUM_LIST } from '../../endpoints';

function getMediumList(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions<PaginatedResponse<MediumModel>>
): UseQueryOptions<PaginatedResponse<MediumModel>> {
  return {
    ...options,
    queryKey: [GET_MEDIUM_LIST, page, limit],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse<MediumModel>>(
        GET_MEDIUM_LIST,
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

export function useGetMediumListQuery(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions<PaginatedResponse<MediumModel>>
): UseQueryResult<PaginatedResponse<MediumModel>> {
  return useQuery(getMediumList({ page, limit }, options));
}

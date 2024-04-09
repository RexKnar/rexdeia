import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { TermModel } from '../../domain/term';
import { GET_TERM_LIST } from '../../endpoints';

function getGroupList(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions<PaginatedResponse<TermModel>>
): UseQueryOptions<PaginatedResponse<TermModel>> {
  return {
    ...options,
    queryKey: [GET_TERM_LIST, page, limit],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse<TermModel>>(
        GET_TERM_LIST,
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

export function useGetTermListQuery(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions<PaginatedResponse<TermModel>>
): UseQueryResult<PaginatedResponse<TermModel>> {
  return useQuery(getGroupList({ page, limit }, options));
}

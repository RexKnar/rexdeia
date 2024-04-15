import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { TermModel } from 'lib/domain/exam';
import { GET_TERM_LIST } from 'lib/endpoints';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';

function getTermsList(
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

export function useGetTermsListQuery(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions<PaginatedResponse<TermModel>>
): UseQueryResult<PaginatedResponse<TermModel>> {
  return useQuery(getTermsList({ page, limit }, options));
}

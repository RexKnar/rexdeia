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
  {
    page,
    limit,
    filter,
  }: { page: number; limit: number; filter: { isActive?: boolean } },
  options?: UseQueryOptions
): UseQueryOptions {
  return {
    ...options,
    queryKey: [GET_TERM_LIST, page, limit, filter],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse>(
        GET_TERM_LIST,
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

export function useGetTermsListQuery(
  {
    page,
    limit,
    filter,
  }: { page: number; limit: number; filter: { isActive?: boolean } },
  options?: UseQueryOptions
): UseQueryResult {
  return useQuery(getTermsList({ page, limit, filter }, options));
}

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
  {
    page,
    limit,
    filter,
  }: {
    page: number;
    limit: number;
    filter: {
      isActive?: boolean;
    };
  },
  options?: UseQueryOptions
): UseQueryOptions {
  return {
    ...options,
    queryKey: [GET_MEDIUM_LIST, page, limit, filter],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse>(
        GET_MEDIUM_LIST,

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

export function useGetMediumListQuery(
  {
    page,
    limit,
    filter,
  }: {
    page: number;
    limit: number;
    filter: {
      isActive?: boolean;
    };
  },
  options?: UseQueryOptions
): UseQueryResult {
  return useQuery(getMediumList({ page, limit, filter }, options));
}

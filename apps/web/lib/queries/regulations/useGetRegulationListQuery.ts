import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { RegulationModel } from '../../domain/regulation';
import { GET_REGULATION_LIST } from '../../endpoints';

function getRegulationList(
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
  options?: UseQueryOptions<PaginatedResponse<RegulationModel>>
): UseQueryOptions<PaginatedResponse<RegulationModel>> {
  return {
    ...options,
    queryKey: [GET_REGULATION_LIST, page, limit],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse<RegulationModel>>(
        GET_REGULATION_LIST,
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

export function useGetRegulationListQuery(
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
  options?: UseQueryOptions<PaginatedResponse<RegulationModel>>
): UseQueryResult<PaginatedResponse<RegulationModel>> {
  return useQuery(getRegulationList({ page, limit, filter }, options));
}

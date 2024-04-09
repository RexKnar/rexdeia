import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { GroupModel } from '../../domain/group';
import { GET_GROUP_LIST } from '../../endpoints';

function getGroupList(
  { page, limit, filter }: { page: number; limit: number; filter: { isActive?: boolean } },
  options?: UseQueryOptions<PaginatedResponse<GroupModel>>
): UseQueryOptions<PaginatedResponse<GroupModel>> {
  return {
    ...options,
    queryKey: [GET_GROUP_LIST, page, limit, filter],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse<GroupModel>>(
        GET_GROUP_LIST,
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

export function useGetGroupListQuery(
  { page, limit, filter }: { page: number; limit: number; filter: { isActive?: boolean } },
  options?: UseQueryOptions<PaginatedResponse<GroupModel>>
): UseQueryResult<PaginatedResponse<GroupModel>> {
  return useQuery(getGroupList({ page, limit, filter }, options));
}

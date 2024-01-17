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
  { page, limit, status }: { page: number; limit: number; status: boolean },
  options?: UseQueryOptions<PaginatedResponse<GroupModel>>
): UseQueryOptions<PaginatedResponse<GroupModel>> {
  return {
    ...options,
    queryKey: [GET_GROUP_LIST, page, limit, status],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse<GroupModel>>(
        GET_GROUP_LIST,
        {},
        {
          page: page,
          limit: limit,
          status: status,
        },
        {}
      );
    },
  };
}

export function useGetGroupListQuery(
  { page, limit, status }: { page: number; limit: number; status: boolean },
  options?: UseQueryOptions<PaginatedResponse<GroupModel>>
): UseQueryResult<PaginatedResponse<GroupModel>> {
  return useQuery(getGroupList({ page, limit, status }, options));
}

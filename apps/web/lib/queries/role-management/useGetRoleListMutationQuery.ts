import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { RoleModel } from 'lib/domain/role';

import { makeAPICall } from '../../api';
import { GET_ROLE_LIST } from '../../endpoints';

type RoleListResponse = {
  page: number;
  total: number;
  limit: number;
  data: RoleModel[];
};

function getRoleListQuery(
  page: number,
  limit: number,
  options?: Partial<UseQueryOptions<RoleListResponse>>
) {
  return {
    ...options,
    queryKey: [GET_ROLE_LIST, page, limit],
    queryFn: async () =>
      await makeAPICall<RoleListResponse>(
        GET_ROLE_LIST,
        undefined,
        { page: page.toString(), limit: limit.toString() },
        {}
      ),
  };
}

export function useGetRoleListQuery(
  page: number,
  limit: number,
  options?: Partial<UseQueryOptions<RoleListResponse>>
) {
  return useQuery(getRoleListQuery(page, limit, options));
}

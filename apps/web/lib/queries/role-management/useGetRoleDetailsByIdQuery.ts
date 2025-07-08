import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { RoleModel } from '../../domain/role';
import { GET_ROLE_BY_ID } from '../../endpoints';

function getRoleById(
  roleId: string,
  options?: UseQueryOptions<RoleModel>
): UseQueryOptions<RoleModel> {
  return {
    ...options,
    queryKey: [GET_ROLE_BY_ID, roleId],
    queryFn: async () => {
      return await makeAPICall<RoleModel>(GET_ROLE_BY_ID, {}, {}, { roleId });
    },
  };
}
export function useGetRoleDetailsByIdQuery(
  roleId: string,
  options?: UseQueryOptions<RoleModel>
): UseQueryResult<RoleModel> {
  return useQuery(getRoleById(roleId, options));
}

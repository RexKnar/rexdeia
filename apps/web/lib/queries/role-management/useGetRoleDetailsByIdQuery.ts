import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { RoleModel } from 'lib/domain/role';

import { makeAPICall } from '../../api';
import { GET_ROLE_BY_ID } from '../../endpoints';

function getSectionByIdQuery(
  roleId: string,
  options?: Partial<UseQueryOptions<RoleModel>>
): UseQueryOptions<RoleModel> {
  return {
    ...options,
    queryKey: [GET_ROLE_BY_ID, roleId],
    queryFn: async () => {
      return await makeAPICall<RoleModel>(
        GET_ROLE_BY_ID,
        {},
        {},
        { roleId: roleId }
      );
    },
  };
}
export function useGetRoleDetailsByIdQuery(
  sectionId: string,
  options?: Partial<UseQueryOptions<RoleModel>>
): UseQueryResult<RoleModel> {
  return useQuery(getSectionByIdQuery(sectionId, options));
}

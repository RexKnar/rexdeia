import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RoleModel } from 'lib/domain/role';

import { makeAPICall } from '../../api';
import { ADD_ROLE_MODULE_ACCESS, GET_ROLE_LIST } from '../../endpoints';

type CreateRoleModuleAccessPayload = {
  roleId: string;
  moduleAccess: {
    module: string;
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  }[];
};

export function useCreateRoleModuleAccessQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateRoleModuleAccessPayload) => {
      return await makeAPICall<RoleModel>(
        ADD_ROLE_MODULE_ACCESS,
        payload,
        {},
        { roleId: payload.roleId }
      );
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [GET_ROLE_LIST],
      });
    },
  });
}

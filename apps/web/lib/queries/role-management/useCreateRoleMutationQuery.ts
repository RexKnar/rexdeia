import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddRoleModel, RoleModel } from 'lib/domain/role';

import { makeAPICall } from '../../api';
import { ADD_ROLE, GET_ROLE_LIST } from '../../endpoints';

type CreateRolePayload = AddRoleModel & {
  moduleAccess: {
    module: string;
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  }[];
};

export function useCreateRoleMutationQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rolePayload: CreateRolePayload) => {
      return await makeAPICall<RoleModel>(ADD_ROLE, rolePayload, {}, {});
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [GET_ROLE_LIST],
      });
    },
  });
}

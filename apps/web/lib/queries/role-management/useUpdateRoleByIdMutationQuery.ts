import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RoleModel, UpdateRoleModel } from 'lib/domain/role';

import { makeAPICall } from '../../api';
import { GET_ROLE_LIST, UPDATE_ROLE_BY_ID } from '../../endpoints';

export function useUpdateRoleByIdMutationQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateRoleModel) => {
      await makeAPICall<RoleModel>(
        UPDATE_ROLE_BY_ID,
        payload,
        {},
        { roleId: payload.id }
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [GET_ROLE_LIST],
      });
    },
  });
}

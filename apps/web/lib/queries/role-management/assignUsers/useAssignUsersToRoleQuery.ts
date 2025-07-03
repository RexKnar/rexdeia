import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { ASSIGN_USERS_TO_ROLE, GET_ROLE_BY_ID } from 'lib/endpoints';

export function useAssignUsersToRoleQuery(roleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rolePayload: { userIds: string[] }) => {
      return await makeAPICall(
        ASSIGN_USERS_TO_ROLE,
        rolePayload,
        {},
        { roleId }
      );
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [GET_ROLE_BY_ID, roleId],
      });
    },
  });
}

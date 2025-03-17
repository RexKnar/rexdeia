import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { UPDATE_USER_PASSWORD } from '../../endpoints';

export function useUpdateUserPasswordMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      currentPassword: string;
      newPassword: string;
    }) => {
      return await makeAPICall(UPDATE_USER_PASSWORD, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries();
    },
  });
}

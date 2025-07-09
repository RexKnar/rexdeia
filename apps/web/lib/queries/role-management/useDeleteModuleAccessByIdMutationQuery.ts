import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { DELETE_ROLE_MODULE, GET_ROLE_LIST } from '../../endpoints';

export function useDeleteModuleAccessByIdMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (moduleAccessId: string) => {
      await makeAPICall(DELETE_ROLE_MODULE, {}, {}, { moduleAccessId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_ROLE_LIST] });
    },
  });
}

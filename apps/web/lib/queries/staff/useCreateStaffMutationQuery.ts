import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { AddStaffModel } from '../../domain/staff';
import { ADD_STAFF } from '../../endpoints';

export function useCreateStaffMutationQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (shareDetails: AddStaffModel) => {
      return await makeAPICall(ADD_STAFF, shareDetails, {}, {});
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({});
    },
  });
}

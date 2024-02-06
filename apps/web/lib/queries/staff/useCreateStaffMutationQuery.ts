import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { AddStaffModel } from '../../domain/staff';
import { ADD_STAFF } from '../../endpoints';

export function useCreateStaffMutationQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (staffDetails: AddStaffModel) => {
      return await makeAPICall(ADD_STAFF, staffDetails, {}, {});
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({});
    },
  });
}

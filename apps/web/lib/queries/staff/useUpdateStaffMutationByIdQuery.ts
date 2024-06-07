import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateStaffModel } from 'lib/domain/staff';

import { makeAPICall } from '../../api';
import { GET_STAFF_BY_ID, UPDATE_STAFF_BY_ID } from '../../endpoints';

export function useUpdateStaffMutationById() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateStaffModel & { id: string }) => {
      const updatedStaff = await makeAPICall<UpdateStaffModel>(
        UPDATE_STAFF_BY_ID,
        payload,
        {},
        { id: payload.id }
      );

      await queryClient.invalidateQueries({
        queryKey: [GET_STAFF_BY_ID, payload.id],
      });
      return updatedStaff;
    },
  });
}

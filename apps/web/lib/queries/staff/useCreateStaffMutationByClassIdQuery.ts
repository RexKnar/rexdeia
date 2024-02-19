import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { LinkStaffModel } from '../../domain/class';
import { ASSIGN_STAFF_BY_CLASS_ID, GET_STAFF_LIST } from '../../endpoints';

export function useCreateStaffMutationByClassIdQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: LinkStaffModel & { classId: string }) => {
      await makeAPICall<LinkStaffModel>(
        ASSIGN_STAFF_BY_CLASS_ID,
        payload,
        {},
        { id: payload.classId }
      );
      await queryClient.invalidateQueries({
        queryKey: [GET_STAFF_LIST],
      });
    },
  });
}

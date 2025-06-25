import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  GET_STAFF_LIST_BY_CLASS_ID,
  UNASSIGN_CLASS_INCHARGE_BY_ID,
} from 'lib/endpoints';

import { makeAPICall } from '../../api';

export function useUnassignClassInchargeMutationQuery(
  classId: string,
  staffId: string,
  academicYearId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Record<string, any> = {}) => {
      const response = await makeAPICall(
        UNASSIGN_CLASS_INCHARGE_BY_ID,
        payload,
        { academicYearId },
        { id: classId, staffId }
      );

      await queryClient.invalidateQueries({
        queryKey: [GET_STAFF_LIST_BY_CLASS_ID, classId],
      });

      return response;
    },
  });
}

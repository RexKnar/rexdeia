import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  GET_ALL_SECTIONS_BY_CLASS_ID,
  GET_SECTION_BY_ID,
  GET_STAFF_LIST_BY_CLASS_ID,
  UNASSIGN_CLASS_INCHARGE_BY_ID,
} from 'lib/endpoints';

import { makeAPICall } from '../../api';

export function useUnassignClassInchargeMutationQuery(
  classId: string,
  academicYearId: string,
  sectionId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { staffId: string }) => {
      const { staffId } = payload;

      const response = await makeAPICall(
        UNASSIGN_CLASS_INCHARGE_BY_ID,
        {},
        { academicYearId },
        { id: classId, staffId, sectionId }
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [GET_STAFF_LIST_BY_CLASS_ID, classId],
        }),
        queryClient.invalidateQueries({
          queryKey: [GET_ALL_SECTIONS_BY_CLASS_ID, classId],
        }),
        queryClient.invalidateQueries({
          queryKey: [GET_SECTION_BY_ID, sectionId],
        }),
      ]);

      return response;
    },
  });
}

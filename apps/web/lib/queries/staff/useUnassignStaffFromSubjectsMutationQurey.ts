import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UnassignStaffModel } from 'lib/domain/staff';
import {
  GET_STAFF_SUBJECT_LIST_BY_CLASS_ID,
  UNASSIGN_STAFF_SECTION_BY_ID,
} from 'lib/endpoints';

import { makeAPICall } from '../../api';

export function useUnassignStaffFromSubjectMutationQurey(
  classId: string,
  staffId: string,
  academicYearId: string
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UnassignStaffModel) => {
      console.log(payload)
      const response = await makeAPICall(
        UNASSIGN_STAFF_SECTION_BY_ID,
        payload,
        { academicYearId: academicYearId },
        { id: classId, staffId: staffId }
      );
      await queryClient.refetchQueries({
        queryKey: [GET_STAFF_SUBJECT_LIST_BY_CLASS_ID, classId],
      });

      return response;
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import {
  ARCHIVE_STUDENT_BY_ID,
  GET_STUDENT_LIST_BY_CLASS_ID,
  GET_STUDENT_LIST_BY_SECTION_ID,
} from '../../endpoints';

export function useArchiveStudentMutationById() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { studentId: string; remark: string }) => {
      const updatedStudent = await makeAPICall<any>(
        ARCHIVE_STUDENT_BY_ID,
        payload,
        {},
        { id: payload.studentId }
      );

      await queryClient.invalidateQueries({
        queryKey: [GET_STUDENT_LIST_BY_SECTION_ID],
      });
      await queryClient.invalidateQueries({
        queryKey: [GET_STUDENT_LIST_BY_CLASS_ID],
      });
      return updatedStudent;
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import {
  ARCHIVE_STUDENTS_FOR_PROMOTE,
  GET_STUDENT_LIST_BY_CLASS_ID,
  GET_STUDENT_LIST_BY_SECTION_ID,
} from '../../endpoints';

type ArchiveStudentsPayload = {
  studentIds: string[];
  remark?: string;
};

export function useArchiveStudentsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ArchiveStudentsPayload) => {
      const response = await makeAPICall<any>(
        ARCHIVE_STUDENTS_FOR_PROMOTE,
        payload
      );
      await queryClient.invalidateQueries({
        queryKey: [GET_STUDENT_LIST_BY_CLASS_ID],
      });

      await queryClient.invalidateQueries({
        queryKey: [GET_STUDENT_LIST_BY_SECTION_ID],
      });

      return response;
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import {
  GET_STUDENT_LIST_BY_CLASS_ID,
  GET_STUDENT_LIST_BY_SECTION_ID,
  UPDATE_STUDENT_STATUS,
} from '../../endpoints';

type UpdateStudentStatusPayload = {
  studentIds: string[];
  data: {
    isCurrent: boolean;
    remark?: string;
  };
};

export function useUpdateStudentStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateStudentStatusPayload) => {
      const response = await makeAPICall<any>(UPDATE_STUDENT_STATUS, payload);

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

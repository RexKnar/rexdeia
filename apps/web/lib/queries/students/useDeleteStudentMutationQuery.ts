import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { DELETE_STUDENT_BY_ID, GET_STUDENTS_LIST } from '../../endpoints';

export function useDeleteStudentMutationQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await makeAPICall<unknown>(
        DELETE_STUDENT_BY_ID,
        {},
        {},
        { id }
      );
      await queryClient.refetchQueries({
        queryKey: [GET_STUDENTS_LIST],
      });
      return response;
    },
  });
}

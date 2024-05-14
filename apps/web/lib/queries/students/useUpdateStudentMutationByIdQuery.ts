import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateStudentModel } from 'lib/domain/student';

import { makeAPICall } from '../../api';
import { GET_STUDENT_BY_ID, UPDATE_STUDENT_BY_ID } from '../../endpoints';

export function useUpdateStudentMutationById() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateStudentModel & { id: string }) => {
      const updatedStudent = await makeAPICall<UpdateStudentModel>(
        UPDATE_STUDENT_BY_ID,
        payload,
        {},
        { id: payload.id }
      );

      await queryClient.invalidateQueries({
        queryKey: [GET_STUDENT_BY_ID, payload.id],
      });
      return updatedStudent;
    },
  });
}

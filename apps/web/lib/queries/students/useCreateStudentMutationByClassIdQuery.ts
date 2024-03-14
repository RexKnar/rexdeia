import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AssignStudentsToClassModel } from 'lib/domain/student';

import { makeAPICall } from '../../api';
import { ASSIGN_STUDENT_BY_CLASS_ID, GET_STUDENTS_LIST } from '../../endpoints';

export function useCreateStudentMutationByClassIdQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      payload: AssignStudentsToClassModel & { classId: string }
    ) => {
      await makeAPICall<AssignStudentsToClassModel>(
        ASSIGN_STUDENT_BY_CLASS_ID,
        payload,
        {},
        { id: payload.classId }
      );
      await queryClient.invalidateQueries({
        queryKey: [GET_STUDENTS_LIST],
      });
    },
  });
}

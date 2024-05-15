import { useMutation } from '@tanstack/react-query';
import { AssignStudentsToClassModel } from 'lib/domain/student';

import { makeAPICall } from '../../api';
import { ASSIGN_STUDENT_BY_CLASS_ID } from '../../endpoints';

export function useCreateStudentMutationByClassIdQuery() {
  return useMutation({
    mutationFn: async (
      payload: AssignStudentsToClassModel & { classId: string }
    ) => {
      return await makeAPICall<AssignStudentsToClassModel>(
        ASSIGN_STUDENT_BY_CLASS_ID,
        payload,
        {},
        { id: payload.classId }
      );
    },
  });
}

import { useMutation } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { AddStudentModel, Student } from '../../domain';
import { ADD_STUDENT } from '../../endpoints';

export function useCreateStudentMutation(formId: string) {
  return useMutation({
    mutationFn: async (studentDetails: AddStudentModel) => {
      return await makeAPICall<Student>(
        ADD_STUDENT,
        studentDetails,
        { formId },
        {}
      );
    },
  });
}

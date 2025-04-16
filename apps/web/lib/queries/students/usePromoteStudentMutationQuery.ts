import { useMutation } from '@tanstack/react-query';
import { PromoteStudentsToNewClassModel } from 'lib/domain/student';

import { makeAPICall } from '../../api';
import { ASSIGN_STUDENTS_FOR_PROMOTE } from '../../endpoints';

export function usePromoteStudentsMutationQuery() {
  return useMutation({
    mutationFn: async (payload: PromoteStudentsToNewClassModel) => {
      return await makeAPICall(ASSIGN_STUDENTS_FOR_PROMOTE, payload, {}, {});
    },
  });
}

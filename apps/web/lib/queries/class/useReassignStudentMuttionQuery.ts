import { useMutation } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { SwitchStudentsToClassModel } from 'lib/domain/student';
import { REASSIGN_STUDENT } from 'lib/endpoints';

export function useReassignStudentMuttionQuery() {
  return useMutation({
    mutationFn: async (payload: SwitchStudentsToClassModel) => {
      return await makeAPICall<SwitchStudentsToClassModel>(
        REASSIGN_STUDENT,
        payload,
        {},
        { id: payload.classId }
      );
    },
  });
}

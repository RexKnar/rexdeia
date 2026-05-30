import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SaveStudentAttendanceModel } from 'lib/domain/timetable';
import {
  GET_STUDENT_ATTENDANCE,
  SAVE_STUDENT_ATTENDANCE,
} from 'lib/endpoints';

import { makeAPICall } from '../../api';

export function useSaveStudentAttendanceMutationQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SaveStudentAttendanceModel) => {
      const response = await makeAPICall(
        SAVE_STUDENT_ATTENDANCE,
        payload,
        {},
        {}
      );
      await queryClient.invalidateQueries({
        queryKey: [GET_STUDENT_ATTENDANCE, payload.sectionId, payload.date],
      });
      return response;
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  GET_STAFF_ATTENDANCE,
  MARK_STAFF_ATTENDANCE,
} from 'lib/endpoints';
import { MarkStaffAttendanceModel } from 'lib/domain/timetable';

import { makeAPICall } from '../../api';

export function useMarkStaffAttendanceMutationQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: MarkStaffAttendanceModel) => {
      const response = await makeAPICall(
        MARK_STAFF_ATTENDANCE,
        payload,
        {},
        {}
      );
      await queryClient.invalidateQueries({
        queryKey: [GET_STAFF_ATTENDANCE, payload.date],
      });
      return response;
    },
  });
}

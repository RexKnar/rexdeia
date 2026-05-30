import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SaveTimetableGridModel } from 'lib/domain/timetable';
import { GET_TIMETABLE_GRID, SAVE_TIMETABLE_GRID } from 'lib/endpoints';

import { makeAPICall } from '../../api';

export function useSaveTimetableGridMutationQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SaveTimetableGridModel) => {
      const response = await makeAPICall(
        SAVE_TIMETABLE_GRID,
        payload,
        {},
        {}
      );
      await queryClient.invalidateQueries({
        queryKey: [GET_TIMETABLE_GRID, payload.sectionId],
      });
      return response;
    },
  });
}

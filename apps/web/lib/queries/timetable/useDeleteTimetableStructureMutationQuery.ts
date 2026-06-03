import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DELETE_TIMETABLE_STRUCTURE,
  GET_TIMETABLE_STRUCTURES,
} from 'lib/endpoints';

import { makeAPICall } from '../../api';

export function useDeleteTimetableStructureMutationQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await makeAPICall(
        DELETE_TIMETABLE_STRUCTURE,
        {},
        {},
        { id }
      );
      await queryClient.invalidateQueries({
        queryKey: [GET_TIMETABLE_STRUCTURES],
      });
      return response;
    },
  });
}

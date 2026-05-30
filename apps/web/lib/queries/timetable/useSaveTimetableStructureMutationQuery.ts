import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  SaveTimetableStructureModel,
  TimetableStructureModel,
} from 'lib/domain/timetable';
import {
  GET_TIMETABLE_STRUCTURES,
  SAVE_TIMETABLE_STRUCTURE,
  UPDATE_TIMETABLE_STRUCTURE,
} from 'lib/endpoints';

import { makeAPICall } from '../../api';

/**
 * Creates a new timetable structure, or updates the existing one when an id is
 * supplied (the builder loads any existing structure for the chosen class level).
 */
export function useSaveTimetableStructureMutationQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SaveTimetableStructureModel) => {
      const response = payload.id
        ? await makeAPICall<TimetableStructureModel>(
            UPDATE_TIMETABLE_STRUCTURE,
            payload,
            {},
            { id: payload.id }
          )
        : await makeAPICall<TimetableStructureModel>(
            SAVE_TIMETABLE_STRUCTURE,
            payload,
            {},
            {}
          );

      await queryClient.invalidateQueries({
        queryKey: [GET_TIMETABLE_STRUCTURES],
      });
      return response;
    },
  });
}

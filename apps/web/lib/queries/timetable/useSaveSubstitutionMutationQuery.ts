import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SaveSubstitutionModel } from 'lib/domain/timetable';
import {
  GET_STAFF_SUBSTITUTION,
  SAVE_STAFF_SUBSTITUTION,
} from 'lib/endpoints';

import { makeAPICall } from '../../api';

export function useSaveSubstitutionMutationQuery(staffId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SaveSubstitutionModel) => {
      const response = await makeAPICall(
        SAVE_STAFF_SUBSTITUTION,
        payload,
        {},
        {}
      );
      await queryClient.invalidateQueries({
        queryKey: [GET_STAFF_SUBSTITUTION, staffId, payload.date],
      });
      return response;
    },
  });
}

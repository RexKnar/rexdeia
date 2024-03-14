import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { MediumModel, UpdateMediumRequestModel } from '../../domain/medium';
import { GET_MEDIUM_LIST, UPDATE_MEDIUM_BY_ID } from '../../endpoints';

export function useUpdateMediumMutationQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateMediumRequestModel) => {
      const response = await makeAPICall<MediumModel>(
        UPDATE_MEDIUM_BY_ID,
        payload,
        {},
        { id: payload.id }
      );
      await queryClient.refetchQueries({
        queryKey: [GET_MEDIUM_LIST],
      });

      return response;
    },
  });
}

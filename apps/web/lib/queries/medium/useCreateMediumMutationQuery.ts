import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { CreateMediumRequestModel, MediumModel } from '../../domain/medium';
import { ADD_MEDIUM, GET_MEDIUM_LIST } from '../../endpoints';

export function useCreateMediumMutationQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (shareDetails: CreateMediumRequestModel) => {
      const response = await makeAPICall<MediumModel>(
        ADD_MEDIUM,
        shareDetails,
        {},
        {}
      );
      await queryClient.invalidateQueries({
        queryKey: [GET_MEDIUM_LIST],
      });

      return response;
    },
  });
}

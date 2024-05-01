import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateTermModel, TermModel } from 'lib/domain/exam';
import { ADD_TERM, GET_TERM_LIST } from 'lib/endpoints';

import { makeAPICall } from '../../api';

export function useCreateTermMutationQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateTermModel) => {
      const response = await makeAPICall<TermModel>(ADD_TERM, payload, {}, {});
      await queryClient.invalidateQueries({
        queryKey: [GET_TERM_LIST],
      });

      return response;
    },
  });
}

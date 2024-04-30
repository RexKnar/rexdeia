import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { TermModel, UpdateTermModel } from 'lib/domain/exam';
import { GET_TERM_LIST, UPDATE_TERM_BY_ID } from 'lib/endpoints';

export function useUpdateTermMutationQuery({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateTermModel) => {
      const response = await makeAPICall<TermModel>(
        UPDATE_TERM_BY_ID,
        payload,
        {},
        { id: payload.id }
      );
      await queryClient.refetchQueries({
        queryKey: [GET_TERM_LIST, page, limit],
      });

      return response;
    },
  });
}

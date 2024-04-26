import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DELETE_EXAM_TYPE_BY_ID, GET_EXAM_TYPE_LIST } from 'lib/endpoints';

import { makeAPICall } from '../../api';

export function useDeleteExamTypeMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await makeAPICall<unknown>(
        DELETE_EXAM_TYPE_BY_ID,
        {},
        {},
        { id }
      );
      await queryClient.refetchQueries({
        queryKey: [GET_EXAM_TYPE_LIST, page, limit],
      });

      return response;
    },
  });
}

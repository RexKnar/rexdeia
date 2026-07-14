import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DELETE_EXAM, GET_EXAM_LIST } from 'lib/endpoints';

import { makeAPICall } from '../../api';

export function useDeleteExamMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (examId: string) => {
      const response = await makeAPICall<unknown>(
        DELETE_EXAM,
        {},
        {},
        { id: examId }
      );
      return response;
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_EXAM_LIST, page, limit],
      });
    },
  });
}

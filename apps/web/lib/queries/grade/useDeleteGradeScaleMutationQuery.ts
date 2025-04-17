import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { DELETE_GRADE_SCALE_BY_ID, GET_GRADE_LIST } from '../../endpoints';

export function useDeleteGradeScaleMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return await makeAPICall<unknown>(
        DELETE_GRADE_SCALE_BY_ID,
        {},
        {},
        { id }
      );
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_GRADE_LIST, page, limit],
      });
    },
  });
}

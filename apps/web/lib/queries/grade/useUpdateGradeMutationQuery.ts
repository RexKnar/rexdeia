import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { GradeModel, UpdateGradeModel } from '../../domain/grade';
import { GET_GRADE_LIST, UPDATE_GRADE_BY_ID } from '../../endpoints';

export function useUpdateGradeMutationQuery(
  gradeId: string,
  page: number,
  limit: number
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateGradeModel) => {
      return await makeAPICall<GradeModel>(
        UPDATE_GRADE_BY_ID,
        payload,
        {},
        { id: payload.id }
      );
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_GRADE_LIST, page, limit],
      });
    },
  });
}

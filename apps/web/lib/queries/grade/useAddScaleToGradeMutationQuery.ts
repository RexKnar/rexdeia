import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { AddGradeScaleModel, GradeModel } from '../../domain/grade';
import { ADD_SCALE_TO_GRADE, GET_GRADE_LIST } from '../../endpoints';

export function useAddScaleToGradeMutationQuery(
  gradeId: string,
  page: number,
  limit: number
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AddGradeScaleModel) => {
      return await makeAPICall<GradeModel>(
        ADD_SCALE_TO_GRADE,
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

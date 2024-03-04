import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { AddGradeModel, GradeModel } from '../../domain/grade';
import { ADD_GRADE, GET_GRADE_LIST } from '../../endpoints';

export function useCreateGradeMutationQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (gradePayload: AddGradeModel) => {
      const response = await makeAPICall<GradeModel>(
        ADD_GRADE,
        gradePayload,
        {},
        {}
      );
      await queryClient.refetchQueries({
        queryKey: [GET_GRADE_LIST],
      });
      return response;
    },
  });
}

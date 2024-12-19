import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateExamModel, UpdateExamModel } from 'lib/domain/exam';
import { ADD_EXAM, GET_EXAM_LIST } from 'lib/endpoints';

import { makeAPICall } from '../../api';

export function useCreateExamMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateExamModel) => {
      const response = await makeAPICall<UpdateExamModel>(
        ADD_EXAM,
        payload,
        {},
        {}
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

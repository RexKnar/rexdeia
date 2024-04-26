import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { ExamTypeModel, UpdateExamTypeModel } from '../../domain/exam';
import { GET_EXAM_TYPE_LIST, UPDATE_EXAM_TYPE_BY_ID } from '../../endpoints';

export function useUpdateExamTypeMutationQuery({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateExamTypeModel) => {
      const response = await makeAPICall<ExamTypeModel>(
        UPDATE_EXAM_TYPE_BY_ID,
        payload,
        {},
        { id: payload.id }
      );
      await queryClient.refetchQueries({
        queryKey: [GET_EXAM_TYPE_LIST, page, limit],
      });

      return response;
    },
  });
}

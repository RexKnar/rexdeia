import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ExamModel, UpdateExamModel } from 'lib/domain/exam';
import { GET_EXAM_LIST, UPDATE_EXAM } from 'lib/endpoints';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';

export function useUpdateExamDetailMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateExamModel) => {
      return await makeAPICall<ExamModel>(
        UPDATE_EXAM,
        payload,
        {},
        { id: payload.id }
      );
    },
    onMutate: async (payload: UpdateExamModel) => {
      await queryClient.cancelQueries({
        queryKey: [GET_EXAM_LIST, page, limit],
      });

      const previousExam = queryClient.getQueryData<
        PaginatedResponse<ExamModel>
      >([GET_EXAM_LIST, page, limit]);

      queryClient.setQueryData(
        [GET_EXAM_LIST, page, limit],
        (existingExam: PaginatedResponse<ExamModel>) => {
          return {
            ...existingExam,
            data: [
              ...existingExam.data.map((exam) => {
                if (exam.id === payload.id) {
                  return { ...payload, isUpdating: true };
                }
                return exam;
              }),
            ],
          };
        }
      );

      return { previousExam };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(
        [GET_EXAM_LIST, page, limit],
        context.previousExam
      );
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_EXAM_LIST, page, limit],
      });
    },
  });
}

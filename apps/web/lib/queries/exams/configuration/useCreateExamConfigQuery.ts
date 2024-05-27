import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { ExamConfigModel } from 'lib/domain/exam';
import { ADD_EXAM_CONFIG, GET_SUBJECT_EXAM_CONFIG_DETAIL } from 'lib/endpoints';

export function useCreateExamConfigQuery(examId: string) {
  const queryClient = useQueryClient();
  let sectionId = null;
  let subjectId = null;
  return useMutation({
    mutationFn: async (payload: ExamConfigModel) => {
      return await makeAPICall<ExamConfigModel>(
        ADD_EXAM_CONFIG,
        payload,
        {},
        { id: examId }
      );
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [
          GET_SUBJECT_EXAM_CONFIG_DETAIL,
          examId,
          sectionId,
          subjectId,
        ],
      });
    },
  });
}

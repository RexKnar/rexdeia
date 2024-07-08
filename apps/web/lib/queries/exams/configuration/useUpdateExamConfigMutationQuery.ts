import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { ExamConfigModel } from 'lib/domain/exam';
import {
  EDIT_EXAM_CONFIG_BY_ID,
  GET_SUBJECT_EXAM_CONFIG_DETAIL,
} from 'lib/endpoints';

export function useUpdateExamConfigQuery(examId: string) {
  const queryClient = useQueryClient();
  let sectionId = null;
  let subjectId = null;
  return useMutation({
    mutationFn: async (payload: {
      payload: ExamConfigModel;
      sectionId: string;
      subjectId: string;
    }) => {
      return await makeAPICall<ExamConfigModel>(
        EDIT_EXAM_CONFIG_BY_ID,
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

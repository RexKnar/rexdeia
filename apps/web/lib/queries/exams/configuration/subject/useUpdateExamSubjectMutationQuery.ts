import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { ExamConfigModel } from 'lib/domain/exam';
import { UpdateExamConfigSubjectModel } from 'lib/domain/examSubject';
import {
  EDIT_EXAM_SUBJECT_CONFIG_BY_ID,
  GET_EXAM_CONFIG_SUBJECT_DETAIL_BY_SECTION_IDS,
} from 'lib/endpoints';

export function useUpdateExamSubjectQuery(
  examSubjectId: string,
  examId: string,
  sectionIds: string[],
  subjectId: string
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateExamConfigSubjectModel) => {
      return await makeAPICall<ExamConfigModel>(
        EDIT_EXAM_SUBJECT_CONFIG_BY_ID,
        payload,
        {},
        { examSubjectId }
      );
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [
          GET_EXAM_CONFIG_SUBJECT_DETAIL_BY_SECTION_IDS,
          examId,
          sectionIds,
          subjectId,
        ],
      });
    },
  });
}

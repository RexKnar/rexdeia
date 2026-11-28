import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import {
  ADD_EXAM_SUBJECT_PARTITION,
  GET_EXAM_CONFIG_SUBJECT_DETAIL_BY_SECTION_IDS,
} from 'lib/endpoints';

export type CreateExamPartitionInput = {
  examSubjectId: string;
  assessmentFormatId: string;
  totalMarks: number | string;
  convertTo: number | string;
  minMark: number | string;
  dateToConduct: string;
  order: number | string;
  excludeSubjectValidation: boolean;
};

export function useCreateExamPartitionMutationQuery(
  examId: string,
  sectionIds: string[],
  subjectId: string
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      examSubjectId,
      ...payload
    }: CreateExamPartitionInput) => {
      return await makeAPICall<unknown>(
        ADD_EXAM_SUBJECT_PARTITION,
        payload,
        {},
        { examSubjectId }
      );
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.refetchQueries({
          queryKey: [
            GET_EXAM_CONFIG_SUBJECT_DETAIL_BY_SECTION_IDS,
            examId,
            sectionIds,
            subjectId,
          ],
        }),
        queryClient.invalidateQueries({
          queryKey: [GET_EXAM_CONFIG_SUBJECT_DETAIL_BY_SECTION_IDS, examId],
        }),
      ]);
    },
  });
}

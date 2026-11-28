import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import {
  DELETE_EXAM_SUBJECT_CONFIG_BY_ID,
  GET_EXAM_CONFIG_SUBJECT_DETAIL_BY_SECTION_IDS,
} from 'lib/endpoints';

export function useDeleteExamSubjectMutationQuery(
  examId: string,
  sectionIds: string[],
  subjectId: string
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (examSubjectId: string) => {
      return await makeAPICall<unknown>(
        DELETE_EXAM_SUBJECT_CONFIG_BY_ID,
        {},
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

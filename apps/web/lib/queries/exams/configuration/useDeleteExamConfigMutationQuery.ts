import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import {
  DELETE_EXAM_CONFIG_BY_ID,
  GET_SUBJECT_EXAM_CONFIG_DETAIL,
} from 'lib/endpoints';

export function useDeleteExamSubjectConfigMutationQuery(
  examId: string,
  sectionId: string,
  subjectId: string
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (configId: string) => {
      return await makeAPICall<unknown>(
        DELETE_EXAM_CONFIG_BY_ID,
        {},
        {},
        { id: examId, configId }
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

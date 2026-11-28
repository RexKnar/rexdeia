import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import {
  DELETE_EXAM_CONFIG_BY_ID,
  GET_EXAM_CONFIG_SUBJECT_DETAIL_BY_SECTION_IDS,
  GET_SUBJECT_EXAM_CONFIG_DETAIL,
} from 'lib/endpoints';

export function useDeleteExamSubjectConfigMutationQuery(
  examId: string,
  sectionIdOrIds: string | string[],
  subjectId: string
) {
  const queryClient = useQueryClient();
  const sectionIds = Array.isArray(sectionIdOrIds)
    ? sectionIdOrIds
    : sectionIdOrIds
      ? [sectionIdOrIds]
      : [];
  const primarySectionId = Array.isArray(sectionIdOrIds)
    ? sectionIdOrIds[0] || ''
    : sectionIdOrIds;

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
        queryClient.refetchQueries({
          queryKey: [
            GET_SUBJECT_EXAM_CONFIG_DETAIL,
            examId,
            primarySectionId,
            subjectId,
          ],
        }),
      ]);
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateExamConfigurationModel } from 'lib/domain/exam';
import {
  ADD_EXAM_CONFIGURATION_BY_EXAM_ID,
  GET_SUBJECT_EXAM_CONFIG_DETAIL,
} from 'lib/endpoints';

import { makeAPICall } from '../../api';

export function useCreateExamConfigurationQuery(examId: string) {
  const queryClient = useQueryClient();
  let sectionId = null;
  let subjectId = null;
  return useMutation({
    mutationFn: async (payload: CreateExamConfigurationModel) => {
      sectionId = payload.sectionId;
      subjectId = payload.subjectId;
      return await makeAPICall<CreateExamConfigurationModel>(
        ADD_EXAM_CONFIGURATION_BY_EXAM_ID,
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

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateExamConfigurationModel } from 'lib/domain/exam';
import {
  ADD_EXAM_CONFIGURATION_BY_EXAM_ID,
  GET_EXAM_LIST,
} from 'lib/endpoints';

import { makeAPICall } from '../../api';

export function useCreateExamConfigurationQuery(examId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateExamConfigurationModel) => {
      await makeAPICall<CreateExamConfigurationModel>(
        ADD_EXAM_CONFIGURATION_BY_EXAM_ID,
        payload,
        {},
        { id: examId }
      );
      await queryClient.invalidateQueries({
        queryKey: [GET_EXAM_LIST],
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [GET_EXAM_LIST],
      });
    },
  });
}

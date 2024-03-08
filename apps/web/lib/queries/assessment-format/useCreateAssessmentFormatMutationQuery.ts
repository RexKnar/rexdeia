import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import {
  AssessmentFormatModel,
  CreateAssessmentFormatModel,
} from '../../domain/subject';
import {
  ADD_ASSESSMENT_FORMAT,
  GET_ASSESSMENT_FORMAT_LIST,
} from '../../endpoints';

export function useCreateAssessmentFormatMutationQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (assessmentPayload: CreateAssessmentFormatModel) => {
      const response = await makeAPICall<AssessmentFormatModel>(
        ADD_ASSESSMENT_FORMAT,
        assessmentPayload,
        {},
        {}
      );
      await queryClient.refetchQueries({
        queryKey: [GET_ASSESSMENT_FORMAT_LIST],
      });
      return response;
    },
  });
}

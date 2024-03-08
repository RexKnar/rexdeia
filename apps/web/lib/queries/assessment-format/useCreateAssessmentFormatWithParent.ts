import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AssessmentFormatModel,
  CreateAssessmentFormatModel,
} from 'lib/domain/subject';

import { makeAPICall } from '../../api';
import {
  ADD_ASSESSMENT_FORMAT_WITH_PARENT_ID,
  GET_ASSESSMENT_FORMAT_LIST,
} from '../../endpoints';

export function useCreateAssessmentFormatWithParentMutationQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      assessmentFormatPayload: CreateAssessmentFormatModel
    ) => {
      const response = await makeAPICall<AssessmentFormatModel>(
        ADD_ASSESSMENT_FORMAT_WITH_PARENT_ID,
        assessmentFormatPayload,
        {},
        { id: assessmentFormatPayload.parentId }
      );
      await queryClient.refetchQueries({
        queryKey: [GET_ASSESSMENT_FORMAT_LIST],
      });
      return response;
    },
  });
}

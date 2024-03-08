import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import {
  AssessmentFormatModel,
  UpdateAssessmentFormatModel,
} from '../../domain/subject';
import {
  GET_ASSESSMENT_FORMAT_LIST,
  UPDATE_ASSESSMENT_FORMAT_BY_ID,
} from '../../endpoints';

export function useUpdateAssessmentFormatMutationQuery(
  page: number,
  limit: number
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateAssessmentFormatModel) => {
      return await makeAPICall<AssessmentFormatModel>(
        UPDATE_ASSESSMENT_FORMAT_BY_ID,
        payload,
        {},
        { id: payload.id }
      );
    },
    onMutate: async (payload: UpdateAssessmentFormatModel) => {
      await queryClient.cancelQueries({
        queryKey: [GET_ASSESSMENT_FORMAT_LIST, page, limit],
      });

      const previousAssessmentFormat = queryClient.getQueryData<
        PaginatedResponse<AssessmentFormatModel>
      >([GET_ASSESSMENT_FORMAT_LIST, page, limit]);

      queryClient.setQueryData(
        [GET_ASSESSMENT_FORMAT_LIST, page, limit],
        (
          existingAssessmentFormat: PaginatedResponse<AssessmentFormatModel>
        ) => {
          return {
            ...existingAssessmentFormat,
            data: [
              ...existingAssessmentFormat.data.map((assessment) => {
                if (assessment.id === payload.id) {
                  return { ...payload, isUpdating: true };
                }
                return assessment;
              }),
            ],
          };
        }
      );

      return { previousAssessmentFormat };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(
        [GET_ASSESSMENT_FORMAT_LIST],
        context.previousAssessmentFormat
      );
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_ASSESSMENT_FORMAT_LIST, page, limit],
      });
    },
  });
}

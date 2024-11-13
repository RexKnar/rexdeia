import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { AssessmentFormatModel } from '../../domain/subject';
import {
  DELETE_ASSESSMENT_FORMAT_BY_ID,
  GET_ASSESSMENT_FORMAT_LIST,
} from '../../endpoints';

export function useDeleteAssessmentFormatMutationQuery(
  page: number,
  limit: number
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      return await makeAPICall<unknown>(
        DELETE_ASSESSMENT_FORMAT_BY_ID,
        {},
        {},
        { id }
      );
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: [GET_ASSESSMENT_FORMAT_LIST, page, limit],
      });

      const previousAssessmentFormat =
        queryClient.getQueryData<PaginatedResponse>([
          GET_ASSESSMENT_FORMAT_LIST,
          page,
          limit,
        ]);

      queryClient.setQueryData(
        [GET_ASSESSMENT_FORMAT_LIST, page, limit],
        (currentPaginatedAssessmentFormat: PaginatedResponse) => {
          return {
            ...currentPaginatedAssessmentFormat,
            data: currentPaginatedAssessmentFormat.data.map((assessment) => {
              if (assessment.id !== id) {
                return assessment;
              } else {
                return {
                  ...assessment,
                  isDeleting: true,
                };
              }
            }),
          };
        }
      );

      return { previousAssessmentFormat: previousAssessmentFormat };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(
        [GET_ASSESSMENT_FORMAT_LIST, page, limit],
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

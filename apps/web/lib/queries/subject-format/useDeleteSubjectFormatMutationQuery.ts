import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { SubjectFormatModel } from '../../domain/subject';
import {
  DELETE_SUBJECT_FORMAT_BY_ID,
  GET_SUBJECT_FORMAT_LIST,
} from '../../endpoints';

export function useDeleteSubjectFormatMutationQuery(
  page: number,
  limit: number
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      return await makeAPICall<unknown>(
        DELETE_SUBJECT_FORMAT_BY_ID,
        {},
        {},
        { id }
      );
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: [GET_SUBJECT_FORMAT_LIST, page, limit],
      });

      const previousSubjectFormat = queryClient.getQueryData<
        PaginatedResponse<SubjectFormatModel>
      >([GET_SUBJECT_FORMAT_LIST, page, limit]);

      queryClient.setQueryData(
        [GET_SUBJECT_FORMAT_LIST, page, limit],
        (
          currentPaginatedSubjectFormat: PaginatedResponse<SubjectFormatModel>
        ) => {
          return {
            ...currentPaginatedSubjectFormat,
            data: currentPaginatedSubjectFormat.data.map((subjectFormat) => {
              if (subjectFormat.id !== id) {
                return subjectFormat;
              } else {
                return {
                  ...subjectFormat,
                  isDeleting: true,
                };
              }
            }),
          };
        }
      );

      return { previousSubjectFormat: previousSubjectFormat };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(
        [GET_SUBJECT_FORMAT_LIST, page, limit],
        context.previousSubjectFormat
      );
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_SUBJECT_FORMAT_LIST, page, limit],
      });
    },
  });
}

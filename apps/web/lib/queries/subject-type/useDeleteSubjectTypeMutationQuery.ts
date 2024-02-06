import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { SubjectTypeModel } from '../../domain/subject';
import {
  DELETE_SUBJECT_TYPE_BY_ID,
  GET_SUBJECT_TYPE_LIST,
} from '../../endpoints';

export function useDeleteSubjectTypeMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      return await makeAPICall<unknown>(
        DELETE_SUBJECT_TYPE_BY_ID,
        {},
        {},
        { id }
      );
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: [GET_SUBJECT_TYPE_LIST, page, limit],
      });

      const previousSubjectType = queryClient.getQueryData<
        PaginatedResponse<SubjectTypeModel>
      >([GET_SUBJECT_TYPE_LIST, page, limit]);

      queryClient.setQueryData(
        [GET_SUBJECT_TYPE_LIST, page, limit],
        (currentPaginatedSubjectType: PaginatedResponse<SubjectTypeModel>) => {
          return {
            ...currentPaginatedSubjectType,
            data: currentPaginatedSubjectType.data.map((subjectType) => {
              if (subjectType.id !== id) {
                return subjectType;
              } else {
                return {
                  ...subjectType,
                  isDeleting: true,
                };
              }
            }),
          };
        }
      );

      return { previousSubjectType: previousSubjectType };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(
        [GET_SUBJECT_TYPE_LIST, page, limit],
        context.previousSubjectType
      );
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_SUBJECT_TYPE_LIST, page, limit],
      });
    },
  });
}

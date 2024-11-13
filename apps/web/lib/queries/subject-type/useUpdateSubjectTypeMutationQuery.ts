import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { SubjectTypeModel, UpdateSubjectTypeModel } from '../../domain/subject';
import {
  GET_SUBJECT_TYPE_LIST,
  UPDATE_SUBJECT_TYPE_BY_ID,
} from '../../endpoints';

export function useUpdateSubjectTypeMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateSubjectTypeModel) => {
      return await makeAPICall<SubjectTypeModel>(
        UPDATE_SUBJECT_TYPE_BY_ID,
        payload,
        {},
        { id: payload.id }
      );
    },
    onMutate: async (payload: UpdateSubjectTypeModel) => {
      await queryClient.cancelQueries({
        queryKey: [GET_SUBJECT_TYPE_LIST, page, limit],
      });

      const previousSubjectType = queryClient.getQueryData<PaginatedResponse>([
        GET_SUBJECT_TYPE_LIST,
        page,
        limit,
      ]);

      queryClient.setQueryData(
        [GET_SUBJECT_TYPE_LIST, page, limit],
        (existingSubjectType: PaginatedResponse) => {
          return {
            ...existingSubjectType,
            data: [
              ...existingSubjectType.data.map((subjectType) => {
                if (subjectType.id === payload.id) {
                  return { ...payload, isUpdating: true };
                }
                return subjectType;
              }),
            ],
          };
        }
      );

      return { previousSubjectType };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(
        [GET_SUBJECT_TYPE_LIST],
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

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { CreateSubjectModel, SubjectModel } from '../../domain/subject';
import { ADD_SUBJECT, GET_SUBJECT_LIST } from '../../endpoints';

export function useCreateSubjectMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateSubjectModel) => {
      return await makeAPICall<SubjectModel>(ADD_SUBJECT, payload, {}, {});
    },
    onMutate: async (payload: CreateSubjectModel) => {
      await queryClient.cancelQueries({
        queryKey: [GET_SUBJECT_LIST, page, limit],
      });

      const previousSubject = queryClient.getQueryData<
        PaginatedResponse<SubjectModel>
      >([GET_SUBJECT_LIST, page, limit]);

      queryClient.setQueryData(
        [GET_SUBJECT_LIST, page, limit],
        (existingSubject: PaginatedResponse<SubjectModel>) => {
          return {
            ...existingSubject,
            data: [
              ...existingSubject.data,
              { ...payload, isNewlyAdded: true, status: true },
            ],
          };
        }
      );

      return { previousSubject };
    },

    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_SUBJECT_LIST, page, limit],
      });
    },
  });
}

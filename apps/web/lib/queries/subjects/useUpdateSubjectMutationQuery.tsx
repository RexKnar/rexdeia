import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { SubjectModel, UpdateSubjectModel } from '../../domain/subject';
import { GET_SUBJECT_LIST, UPDATE_SUBJECT_BY_ID } from '../../endpoints';

export function useUpdateSubjectMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateSubjectModel) => {
      return await makeAPICall<SubjectModel>(
        UPDATE_SUBJECT_BY_ID,
        payload,
        {},
        { id: payload.id }
      );
    },
    onMutate: async (payload: UpdateSubjectModel) => {
      await queryClient.cancelQueries({
        queryKey: [GET_SUBJECT_LIST, page, limit],
      });

      const previousSubjects = queryClient.getQueryData<
        PaginatedResponse<SubjectModel>
      >([GET_SUBJECT_LIST, page, limit]);

      queryClient.setQueryData(
        [GET_SUBJECT_LIST, page, limit],
        (existingSubjects: PaginatedResponse<SubjectModel>) => {
          return {
            ...existingSubjects,
            data: [
              ...existingSubjects.data.map((batch) => {
                if (batch.id === payload.id) {
                  return { ...payload, isUpdating: true };
                }
                return batch;
              }),
            ],
          };
        }
      );

      return { previousSubjects };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData([GET_SUBJECT_LIST], context.previousSubjects);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_SUBJECT_LIST, page, limit],
      });
    },
  });
}

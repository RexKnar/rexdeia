import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { SubjectModel } from '../../domain/subject';
import { DELETE_SUBJECT_BY_ID, GET_SUBJECT_LIST } from '../../endpoints';

export function useDeleteSubjectMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      return await makeAPICall<unknown>(DELETE_SUBJECT_BY_ID, {}, {}, { id });
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: [GET_SUBJECT_LIST, page, limit],
      });

      const previousSubjects = queryClient.getQueryData<
        PaginatedResponse<SubjectModel>
      >([GET_SUBJECT_LIST, page, limit]);

      queryClient.setQueryData(
        [GET_SUBJECT_LIST, page, limit],
        (currentPaginatedSubjects: PaginatedResponse<SubjectModel>) => {
          return {
            ...currentPaginatedSubjects,
            data: currentPaginatedSubjects.data.map((subject) => {
              if (subject.id !== id) {
                return subject;
              } else {
                return {
                  ...subject,
                  isDeleting: true,
                };
              }
            }),
          };
        }
      );

      return { previousSubjects: previousSubjects };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(
        [GET_SUBJECT_LIST, page, limit],
        context.previousSubjects
      );
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_SUBJECT_LIST, page, limit],
      });
    },
  });
}

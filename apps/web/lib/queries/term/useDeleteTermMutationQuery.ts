import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { TermModel } from '../../domain/term';
import { DELETE_TERM_BY_ID, GET_TERM_LIST } from '../../endpoints';

export function useDeleteTermMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      return await makeAPICall<unknown>(DELETE_TERM_BY_ID, {}, {}, { id });
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: [GET_TERM_LIST, page, limit],
      });

      const previousTerms = queryClient.getQueryData<
        PaginatedResponse<TermModel>
      >([GET_TERM_LIST, page, limit]);

      queryClient.setQueryData(
        [GET_TERM_LIST, page, limit],
        (currentPaginatedTerms: PaginatedResponse<TermModel>) => {
          return {
            ...currentPaginatedTerms,
            data: currentPaginatedTerms.data.map((group) => {
              if (group.id !== id) {
                return group;
              } else {
                return {
                  ...group,
                  isDeleting: true,
                };
              }
            }),
          };
        }
      );

      return { previousTerms: previousTerms };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(
        [GET_TERM_LIST, page, limit],
        context.previousTerms
      );
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_TERM_LIST, page, limit],
      });
    },
  });
}

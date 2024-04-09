import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { TermModel, UpdateTermModel } from '../../domain/term';
import { GET_TERM_LIST, UPDATE_TERM_BY_ID } from '../../endpoints';

export function useUpdateTermMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateTermModel) => {
      return await makeAPICall<TermModel>(
        UPDATE_TERM_BY_ID,
        payload,
        {},
        { id: payload.id }
      );
    },
    onMutate: async (payload: UpdateTermModel) => {
      await queryClient.cancelQueries({
        queryKey: [GET_TERM_LIST, page, limit],
      });

      const previousTerm = queryClient.getQueryData<
        PaginatedResponse<TermModel>
      >([GET_TERM_LIST, page, limit]);

      queryClient.setQueryData(
        [GET_TERM_LIST, page, limit],
        (existingTerm: PaginatedResponse<TermModel>) => {
          return {
            ...existingTerm,
            data: [
              ...existingTerm.data.map((group) => {
                if (group.id === payload.id) {
                  return { ...payload, isUpdating: true };
                }
                return group;
              }),
            ],
          };
        }
      );

      return { previousTerm };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData([GET_TERM_LIST], context.previousTerm);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_TERM_LIST, page, limit],
      });
    },
  });
}

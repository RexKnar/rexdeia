import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { CreateTermModel, TermModel } from '../../domain/term';
import { ADD_TERM, GET_TERM_LIST } from '../../endpoints';

export function useCreateTermMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (shareDetails: CreateTermModel) => {
      return await makeAPICall<TermModel>(ADD_TERM, shareDetails, {}, {});
    },
    onMutate: async (shareDetails: CreateTermModel) => {
      await queryClient.cancelQueries({
        queryKey: [GET_TERM_LIST, page, limit],
      });

      const previousGroup = queryClient.getQueryData<
        PaginatedResponse<TermModel>
      >([GET_TERM_LIST, page, limit]);

      queryClient.setQueryData(
        [GET_TERM_LIST, page, limit],
        (existingGroup: PaginatedResponse<TermModel>) => {
          return {
            ...existingGroup,
            data: [
              ...existingGroup.data,
              { ...shareDetails, isNewlyAdded: true },
            ],
          };
        }
      );

      return { previousGroup };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData([GET_TERM_LIST], context.previousGroup);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_TERM_LIST, page, limit],
      });
    },
  });
}

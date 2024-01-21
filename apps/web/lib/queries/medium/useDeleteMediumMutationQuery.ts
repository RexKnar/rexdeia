import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { MediumModel } from '../../domain/medium';
import { DELETE_MEDIUM_BY_ID, GET_MEDIUM_LIST } from '../../endpoints';

export function useDeleteMediumMutationQuery(
  page: number,
  limit: number,
  status: boolean
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      return await makeAPICall<unknown>(DELETE_MEDIUM_BY_ID, {}, {}, { id });
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: [GET_MEDIUM_LIST, page, limit, status],
      });

      const previousMedium = queryClient.getQueryData<
        PaginatedResponse<MediumModel>
      >([GET_MEDIUM_LIST, page, limit, status]);

      queryClient.setQueryData(
        [GET_MEDIUM_LIST, page, limit, status],
        (currentPaginatedMedium: PaginatedResponse<MediumModel>) => {
          return {
            ...currentPaginatedMedium,
            data: currentPaginatedMedium.data.map((medium) => {
              if (medium.id !== id) {
                return medium;
              } else {
                return {
                  ...medium,
                  isDeleting: true,
                };
              }
            }),
          };
        }
      );

      return { previousMedium: previousMedium };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(
        [GET_MEDIUM_LIST, page, limit, status],
        context.previousMedium
      );
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_MEDIUM_LIST, page, limit, status],
      });
    },
  });
}

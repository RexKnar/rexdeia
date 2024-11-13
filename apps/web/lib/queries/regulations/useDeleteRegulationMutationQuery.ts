import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { RegulationModel } from '../../domain/regulation';
import { DELETE_REGULATION, GET_REGULATION_LIST } from '../../endpoints';

export function useDeleteRegulationMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (regulationId) => {
      return await makeAPICall<unknown>(
        DELETE_REGULATION,
        {
          regulationId: regulationId,
        },
        {},
        {}
      );
    },
    onMutate: async (regulationId: string) => {
      await queryClient.cancelQueries({
        queryKey: [GET_REGULATION_LIST, page, limit],
      });

      const previousRegulations = queryClient.getQueryData<PaginatedResponse>([
        GET_REGULATION_LIST,
        page,
        limit,
      ]);

      queryClient.setQueryData(
        [GET_REGULATION_LIST, page, limit],
        (currentPaginatedRegulations: PaginatedResponse) => {
          return {
            ...currentPaginatedRegulations,
            data: currentPaginatedRegulations.data.map((regulation) => {
              if (regulation.id !== regulationId) {
                return regulation;
              } else {
                return {
                  ...regulation,
                  isDeleting: true,
                };
              }
            }),
          };
        }
      );

      return { previousRegulations };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(
        [GET_REGULATION_LIST, page, limit],
        context.previousRegulations
      );
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_REGULATION_LIST, page, limit],
      });
    },
  });
}

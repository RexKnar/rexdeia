import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { RegulationModel } from '../../domain/regulation';
import { DELETE_REGULATION, GET_REGULATION_LIST } from '../../endpoints';

export function useDeleteRegulationMutationQuery(page: number) {
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
        queryKey: [GET_REGULATION_LIST],
      });

      const previousRegulations = queryClient.getQueryData<
        PaginatedResponse<RegulationModel>
      >([GET_REGULATION_LIST, page]);

      queryClient.setQueryData(
        [GET_REGULATION_LIST, page],
        (old: PaginatedResponse<RegulationModel>) => {
          return {
            ...old,
            data: old.data.filter(
              (regulation) => regulation.id !== regulationId
            ),
          };
        }
      );

      return { previousRegulations };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(
        [GET_REGULATION_LIST],
        context.previousRegulations
      );
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_REGULATION_LIST],
      });
    },
  });
}

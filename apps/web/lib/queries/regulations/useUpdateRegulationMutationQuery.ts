import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import {
  RegulationModel,
  UpdateRegulationModel,
} from '../../domain/regulation';
import { GET_REGULATION_LIST, UPDATE_REGULATION_BY_ID } from '../../endpoints';

export function useUpdateRegulationMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateRegulationModel) => {
      return await makeAPICall<RegulationModel>(
        UPDATE_REGULATION_BY_ID,
        payload,
        {},
        { id: payload.id }
      );
    },
    onMutate: async (payload: UpdateRegulationModel) => {
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
        (existingRegulations: PaginatedResponse) => {
          return {
            ...existingRegulations,
            data: [
              ...existingRegulations.data.map((regulation) => {
                if (regulation.id === payload.id) {
                  return { ...payload, isUpdating: true };
                }
                return regulation;
              }),
            ],
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
        queryKey: [GET_REGULATION_LIST, page, limit],
      });
    },
  });
}

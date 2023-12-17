import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import {
  CreateRegulationModel,
  RegulationModel,
} from '../../domain/regulation';
import { ADD_REGULATION, GET_REGULATION_LIST } from '../../endpoints';

export function useCreateRegulationsMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (shareDetails: CreateRegulationModel) => {
      return await makeAPICall<RegulationModel>(
        ADD_REGULATION,
        shareDetails,
        {},
        {}
      );
    },
    onMutate: async (shareDetails: CreateRegulationModel) => {
      await queryClient.cancelQueries({
        queryKey: [GET_REGULATION_LIST, page, limit],
      });

      const previousRegulations = queryClient.getQueryData<
        PaginatedResponse<RegulationModel>
      >([GET_REGULATION_LIST, page, limit]);

      queryClient.setQueryData(
        [GET_REGULATION_LIST, page, limit],
        (existingRegulations: PaginatedResponse<RegulationModel>) => {
          return {
            ...existingRegulations,
            data: [
              ...existingRegulations.data,
              { ...shareDetails, isNewlyAdded: true, status: true },
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

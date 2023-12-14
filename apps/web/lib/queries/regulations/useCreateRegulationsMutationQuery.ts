import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import {
  CreateRegulationModel,
  RegulationModel,
} from '../../domain/regulation';
import { ADD_REGULATION, GET_REGULATION_LIST } from '../../endpoints';
import { PaginatedResponse } from '../../domain';

export function useCreateRegulationsMutationQuery(page: number) {
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
        queryKey: [GET_REGULATION_LIST],
      });

      const previousRegulations = queryClient.getQueryData<
        PaginatedResponse<RegulationModel>
      >([GET_REGULATION_LIST, page]);

      queryClient.setQueryData(
        [GET_REGULATION_LIST, page],
        (old: PaginatedResponse<RegulationModel>) => {
          debugger;
          return {
            ...old,
            data: [...old.data, shareDetails],
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

import { RegulationModel, CreateRegulationModel } from '../domain/regulation';
import { useMutation } from '@tanstack/react-query';
import { makeAPICall } from '../api';
import { ADD_REGULATION } from '../endpoints';

export function useCreateRegulationsForFormMutationQuery() {
  return useMutation({
    mutationFn: async (shareDetails: CreateRegulationModel) => {
      return await makeAPICall<RegulationModel>(
        ADD_REGULATION,
        shareDetails,
        {},
        {}
      );
    },
  });
}

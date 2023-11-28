import { useMutation } from '@tanstack/react-query';

import { makeAPICall } from '../api';
import { CreateRegulationModel, RegulationModel } from '../domain/regulation';
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

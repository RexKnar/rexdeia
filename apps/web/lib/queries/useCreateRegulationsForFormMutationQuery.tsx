import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../api';
import { CreateRegulationModel, RegulationModel } from '../domain/regulation';
import { ADD_REGULATION, GET_REGULATION_LIST } from '../endpoints';

export function useCreateRegulationsForFormMutationQuery() {
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
    onSuccess: async () => {
      const queryCache = queryClient.getQueryCache();
      const keysToInvalidate = [GET_REGULATION_LIST];

      queryCache.getAll().forEach((query) => {
        const queryKey = query.queryKey;
        if (
          Array.isArray(queryKey) &&
          keysToInvalidate.includes(queryKey[0] as string)
        ) {
          queryClient.invalidateQueries({
            queryKey: queryKey,
          });
        }
      });
    },
  });
}

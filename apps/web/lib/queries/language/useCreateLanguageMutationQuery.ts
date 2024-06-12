import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { CreateLanguageRequestModel, LanguageModel } from 'lib/domain/language';
import { ADD_LANGUAGE, GET_ALL_LANGUAGE } from 'lib/endpoints';

export function useCreateCommunityMutationQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (languageDetails: CreateLanguageRequestModel) => {
      const response = await makeAPICall<LanguageModel>(
        ADD_LANGUAGE,
        languageDetails,
        {},
        {}
      );
      await queryClient.invalidateQueries({
        queryKey: [GET_ALL_LANGUAGE],
      });

      return response;
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_ALL_LANGUAGE],
      });
    },
  });
}

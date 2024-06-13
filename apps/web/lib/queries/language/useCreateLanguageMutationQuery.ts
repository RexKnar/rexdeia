import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { CreateLanguageRequestModel, LanguageModel } from 'lib/domain/language';
import { ADD_LANGUAGE, GET_LANGUAGE_LIST } from 'lib/endpoints';

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
        queryKey: [GET_LANGUAGE_LIST],
      });

      return response;
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_LANGUAGE_LIST],
      });
    },
  });
}

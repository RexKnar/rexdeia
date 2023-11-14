import { CreateShareModal, ShareModal } from '../domain';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from '../api';
import {
  GET_ADMISSIONS_FORM_SHARE_DETAILS,
  SAVE_SHARE_FOR_FORM,
} from '../endpoints';

export function useSaveShareDetailsForFormMutationQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (shareDetails: CreateShareModal) => {
      return await makeAPICall<ShareModal>(
        SAVE_SHARE_FOR_FORM,
        shareDetails,
        {},
        {}
      );
    },
    onSuccess: async (data) => {
      await queryClient.refetchQueries({
        queryKey: [GET_ADMISSIONS_FORM_SHARE_DETAILS, data.formId],
      });
    },
  });
}

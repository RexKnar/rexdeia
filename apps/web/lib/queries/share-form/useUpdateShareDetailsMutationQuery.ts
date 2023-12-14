import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { ShareModal } from '../../domain';
import { UpdateShareModal } from '../../domain/shareModal';
import {
  GET_ADMISSIONS_FORM_SHARE_DETAILS,
  UPDATE_SHARE_FOR_FORM,
} from '../../endpoints';

export function useUpdateShareDetailsMutationQuery(shareId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (shareDetails: UpdateShareModal) => {
      return await makeAPICall<ShareModal>(
        UPDATE_SHARE_FOR_FORM,
        shareDetails,
        {},
        { shareId: shareId }
      );
    },
    onSuccess: async (data) => {
      await queryClient.refetchQueries({
        queryKey: [GET_ADMISSIONS_FORM_SHARE_DETAILS, data.formId],
      });
    },
  });
}

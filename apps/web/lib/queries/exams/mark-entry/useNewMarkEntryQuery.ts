import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { EnterMarkEntryModel } from 'lib/domain/mark-entry';
import { EXAM_MARK_ENTRY, GET_EXAM_LIST } from 'lib/endpoints';

export function useNewMarkEntryQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: EnterMarkEntryModel) => {
      await makeAPICall<EnterMarkEntryModel>(EXAM_MARK_ENTRY, payload, {}, {});
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_EXAM_LIST],
      });
    },
  });
}

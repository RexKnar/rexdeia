import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddMarkEntryModel } from 'lib/domain/mark-entry';
import { ADD_MARK_ENTRY, GET_EXAM_LIST } from 'lib/endpoints';

import { makeAPICall } from '../../api';

export function useCreateMarkEntryQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AddMarkEntryModel) => {
      await makeAPICall<AddMarkEntryModel>(ADD_MARK_ENTRY, payload, {}, {});
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_EXAM_LIST],
      });
    },
  });
}

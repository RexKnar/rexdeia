import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { CreateSectionModel, SectionModel } from '../../domain/section';
import {
  ADD_SECTION,
  GET_ALL_SECTIONS_BY_CLASS_ID,
  GET_CLASS_LIST,
} from '../../endpoints';

export function useCreateSectionMutationQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateSectionModel) => {
      return await makeAPICall<SectionModel>(ADD_SECTION, payload, {}, {});
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [GET_ALL_SECTIONS_BY_CLASS_ID],
      }),
        await queryClient.invalidateQueries({
          queryKey: [GET_CLASS_LIST],
        });
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { SectionModel, UpdateSectionModel } from '../../domain/section';
import { GET_SECTION_BY_ID, UPDATE_SECTION_BY_ID } from '../../endpoints';

export function useUpdateSectionMutationQuery(sectionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateSectionModel) => {
      return await makeAPICall<SectionModel>(
        UPDATE_SECTION_BY_ID,
        payload,
        {},
        { id: sectionId }
      );
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_SECTION_BY_ID, sectionId],
      });
    },
  });
}

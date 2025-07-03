import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import {
  COPY_SECTION,
  GET_ALL_SECTIONS_BY_CLASS_ID,
  GET_CLASS_LIST,
} from 'lib/endpoints';

type CopySectionPayload = {
  classId: string;
  academicYearId: string;
};

export function useCopySectionMutationQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [COPY_SECTION],
    mutationFn: async (payload: CopySectionPayload) => {
      return await makeAPICall<void>(COPY_SECTION, payload, {}, {});
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [GET_ALL_SECTIONS_BY_CLASS_ID, variables.classId],
        }),
        queryClient.invalidateQueries({
          queryKey: [GET_CLASS_LIST],
        }),
      ]);
    },
  });
}

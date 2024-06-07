import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import {
  DELETE_SUBJECT_BY_ID,
  GET_SUBJECT_LIST_BY_CLASS_ID,
} from '../../endpoints';

export function useDeleteSubjectMutationQuery(classId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await makeAPICall<unknown>(DELETE_SUBJECT_BY_ID, {}, {}, { id });
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_SUBJECT_LIST_BY_CLASS_ID, classId],
      });
    },
  });
}

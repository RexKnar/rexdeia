import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { ClassModel, UpdateClassModel } from '../../domain/class';
import { GET_CLASS_BY_ID, UPDATE_CLASS_BY_ID } from '../../endpoints';

export function useUpdateClassMutationQuery(classId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateClassModel) => {
      return await makeAPICall<ClassModel>(
        UPDATE_CLASS_BY_ID,
        payload,
        {},
        { id: payload.id }
      );
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_CLASS_BY_ID, classId],
      });
    },
  });
}

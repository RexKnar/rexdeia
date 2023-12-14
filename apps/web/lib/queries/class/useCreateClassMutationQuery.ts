import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { ClassModel, CreateClassModel } from '../../domain/class';
import { ADD_CLASS, GET_CLASS } from '../../endpoints';

export function useCreateClassMutationQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (classDetails: CreateClassModel) => {
      return await makeAPICall<ClassModel>(ADD_CLASS, classDetails, {}, {});
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_CLASS],
      });
    },
  });
}

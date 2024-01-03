import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { ClassModel, CreateClassModel } from '../../domain/class';
import { ADD_CLASS, GET_CLASS } from '../../endpoints';

export function useCreateClassMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateClassModel) => {
      return await makeAPICall<ClassModel>(ADD_CLASS, payload, {}, {});
    },
    onMutate: async (payload: CreateClassModel) => {
      await queryClient.cancelQueries({
        queryKey: [GET_CLASS, page, limit],
      });

      const previousClasses = queryClient.getQueryData<
        PaginatedResponse<ClassModel>
      >([GET_CLASS, page, limit]);

      if (previousClasses) {
        queryClient.setQueryData(
          [GET_CLASS, page, limit],
          (existingClass: PaginatedResponse<ClassModel>) => {
            return {
              ...existingClass,
              data: [
                ...existingClass.data,
                { ...payload, isNewlyAdded: true, status: true },
              ],
            };
          }
        );

        return { previousClass: previousClasses };
      }
    },
    onError: (error, _, context) => {
      if (context.previousClass) {
        queryClient.setQueryData([GET_CLASS], context.previousClass);
      }
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_CLASS, page, limit],
      });
    },
  });
}

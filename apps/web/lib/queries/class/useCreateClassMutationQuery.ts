import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { ClassModel, CreateClassModel } from '../../domain/class';
import { ADD_CLASS, GET_CLASS_LIST } from '../../endpoints';

export function useCreateClassMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateClassModel) => {
      return await makeAPICall<ClassModel>(ADD_CLASS, payload, {}, {});
    },
    onMutate: async (payload: CreateClassModel) => {
      await queryClient.cancelQueries({
        queryKey: [GET_CLASS_LIST, page, limit],
      });

      const previousClasses = queryClient.getQueryData<PaginatedResponse>([
        GET_CLASS_LIST,
        page,
        limit,
      ]);

      if (previousClasses) {
        queryClient.setQueryData(
          [GET_CLASS_LIST, page, limit],
          (existingClass: PaginatedResponse) => {
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
        queryClient.setQueryData([GET_CLASS_LIST], context.previousClass);
      }
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_CLASS_LIST, page, limit],
      });
    },
  });
}

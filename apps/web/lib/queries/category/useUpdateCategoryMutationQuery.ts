import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { CategoryModel, UpdateCategoryModel } from '../../domain/category';
import { GET_CATEGORY_LIST, UPDATE_CATEGORY_BY_ID } from '../../endpoints';

export function useUpdateCategoryMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateCategoryModel) => {
      return await makeAPICall<CategoryModel>(
        UPDATE_CATEGORY_BY_ID,
        payload,
        {},
        { id: payload.id }
      );
    },
    onMutate: async (payload: UpdateCategoryModel) => {
      await queryClient.cancelQueries({
        queryKey: [GET_CATEGORY_LIST, page, limit],
      });

      const previousCategory = queryClient.getQueryData<
        PaginatedResponse<CategoryModel>
      >([GET_CATEGORY_LIST, page, limit]);

      queryClient.setQueryData(
        [GET_CATEGORY_LIST, page, limit],
        (existingCategory: PaginatedResponse<CategoryModel>) => {
          return {
            ...existingCategory,
            data: [
              ...existingCategory.data.map((category) => {
                if (category.id === payload.id) {
                  return { ...payload, isUpdating: true };
                }
                return category;
              }),
            ],
          };
        }
      );

      return { previousCategory };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData([GET_CATEGORY_LIST], context.previousCategory);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_CATEGORY_LIST, page, limit],
      });
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { CategoryModel } from '../../domain/category';
import { DELETE_CATEGORY_BY_ID, GET_CATEGORY_LIST } from '../../endpoints';

export function useDeleteCategoryMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      return await makeAPICall<unknown>(DELETE_CATEGORY_BY_ID, {}, {}, { id });
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: [GET_CATEGORY_LIST, page, limit],
      });

      const previousCategory = queryClient.getQueryData<
        PaginatedResponse<CategoryModel>
      >([GET_CATEGORY_LIST, page, limit]);

      queryClient.setQueryData(
        [GET_CATEGORY_LIST, page, limit],
        (currentPaginatedCategory: PaginatedResponse<CategoryModel>) => {
          return {
            ...currentPaginatedCategory,
            data: currentPaginatedCategory.data.map((category) => {
              if (category.id !== id) {
                return category;
              } else {
                return {
                  ...category,
                  isDeleting: true,
                };
              }
            }),
          };
        }
      );

      return { previousCategory: previousCategory };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(
        [GET_CATEGORY_LIST, page, limit],
        context.previousCategory
      );
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_CATEGORY_LIST, page, limit],
      });
    },
  });
}

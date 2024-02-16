import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { CategoryModel, CreateCategoryModel } from '../../domain/category';
import {
  ADD_CATEGORY_WITH_PARENT_BY_ID,
  GET_CATEGORY_LIST,
} from '../../endpoints';

export function useCreateCategoryWithParentMutationQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (categoryPayload: CreateCategoryModel) => {
      const response = await makeAPICall<CategoryModel>(
        ADD_CATEGORY_WITH_PARENT_BY_ID,
        categoryPayload,
        {},
        { id: categoryPayload.parentId }
      );
      await queryClient.refetchQueries({
        queryKey: [GET_CATEGORY_LIST],
      });
      return response;
    },
  });
}

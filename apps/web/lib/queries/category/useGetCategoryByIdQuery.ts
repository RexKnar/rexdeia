import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { CategoryModel } from '../../domain/category';
import { GET_CATEGORY_BY_ID } from '../../endpoints';

function getCategoryById(
  categoryId: string,
  options?: Partial<UseQueryOptions<CategoryModel>>
): UseQueryOptions<CategoryModel> {
  return {
    ...options,
    queryKey: [GET_CATEGORY_BY_ID, categoryId],
    queryFn: async () => {
      return await makeAPICall<CategoryModel>(
        GET_CATEGORY_BY_ID,
        {},
        {},
        { id: categoryId }
      );
    },
  };
}
export function useGetCategoryByIdQuery(
  id: string,
  options?: Partial<UseQueryOptions<CategoryModel>>
): UseQueryResult<CategoryModel> {
  return useQuery(getCategoryById(id, options));
}

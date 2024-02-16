import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { CategoryModel } from '../../domain/category';
import { GET_CATEGORY_LIST } from '../../endpoints';

function getCategoryList(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions<PaginatedResponse<CategoryModel>>
): UseQueryOptions<PaginatedResponse<CategoryModel>> {
  return {
    ...options,
    queryKey: [GET_CATEGORY_LIST, page, limit],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse<CategoryModel>>(
        GET_CATEGORY_LIST,
        {},
        {
          page: page,
          limit: limit,
        },
        {}
      );
    },
  };
}

export function useGetCategoryList(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions<PaginatedResponse<CategoryModel>>
): UseQueryResult<PaginatedResponse<CategoryModel>> {
  return useQuery(getCategoryList({ page, limit }, options));
}

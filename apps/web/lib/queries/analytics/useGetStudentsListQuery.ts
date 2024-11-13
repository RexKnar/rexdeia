import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse, Student } from '../../domain';
import { GET_STUDENT_LIST_BY_FILTER_WITH_PAGINATION } from '../../endpoints';

function getStudentListByFilterWithPagination(
  { filter, page, pageSize }: { filter: any; page: number; pageSize: number },
  options?: Partial
) {
  return {
    ...options,
    queryKey: [
      GET_STUDENT_LIST_BY_FILTER_WITH_PAGINATION,
      filter,
      page,
      pageSize,
    ],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse>(
        GET_STUDENT_LIST_BY_FILTER_WITH_PAGINATION,
        filter,
        { page: page, limit: pageSize },
        {}
      );
    },
  };
}

export function useGetStudentListByFilterQuery(
  { filter, page, pageSize }: { filter: any; page: number; pageSize: number },
  options?: Partial
) {
  return useQuery(
    getStudentListByFilterWithPagination({ filter, page, pageSize }, options)
  );
}

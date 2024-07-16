import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse, Student } from '../../domain';
import { GET_STUDENT_SEARCH_LIST } from '../../endpoints';

interface SearchParams {
  searchTerm: string;
  page: number;
  pageSize: number;
}

function getStudentSearchList(
  payload: SearchParams,
  options?: Partial<UseQueryOptions<PaginatedResponse<Student>>>
) {
  return {
    ...options,
    queryKey: [GET_STUDENT_SEARCH_LIST, payload],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse<Student>>(
        GET_STUDENT_SEARCH_LIST,
        {},
        { ...payload },
        {}
      );
    },
  };
}

export function useGetStudentSearchListQuery(
  payload: SearchParams,
  options?: Partial<UseQueryOptions<PaginatedResponse<Student>>>
) {
  return useQuery(getStudentSearchList(payload, options));
}

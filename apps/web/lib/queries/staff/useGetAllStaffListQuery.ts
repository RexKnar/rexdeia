import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { Staff } from '../../domain/staff';
import { GET_STAFF_LIST } from '../../endpoints';

function getStaffList(
  {
    page,
    limit,
    searchTerm,
  }: { page: number; limit: number; searchTerm: string },
  options?: Partial<UseQueryOptions<PaginatedResponse<Staff>>>
): UseQueryOptions<PaginatedResponse<Staff>> {
  return {
    ...options,
    queryKey: [GET_STAFF_LIST, page, limit, searchTerm],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse<Staff>>(
        GET_STAFF_LIST,
        {},
        {
          page,
          limit,
          searchTerm,
        },
        {}
      );
    },
  };
}

export function useGetAllStaffListQuery(
  {
    page,
    limit,
    searchTerm,
  }: { page: number; limit: number; searchTerm: string },
  options?: Partial<UseQueryOptions<PaginatedResponse<Staff>>>
): UseQueryResult<PaginatedResponse<Staff>> {
  return useQuery(getStaffList({ page, limit, searchTerm }, options));
}

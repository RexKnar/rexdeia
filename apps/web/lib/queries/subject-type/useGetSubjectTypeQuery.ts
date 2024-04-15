import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { SubjectTypeModel } from '../../domain/subject';
import { GET_SUBJECT_TYPE_LIST } from '../../endpoints';

function getSubjectTypeList(
  {
    page,
    limit,
    filter,
  }: { page: number; limit: number; filter: { isActive?: boolean } },
  options?: UseQueryOptions<PaginatedResponse<SubjectTypeModel>>
): UseQueryOptions<PaginatedResponse<SubjectTypeModel>> {
  return {
    ...options,
    queryKey: [GET_SUBJECT_TYPE_LIST, page, limit],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse<SubjectTypeModel>>(
        GET_SUBJECT_TYPE_LIST,
        filter,
        {
          page: page,
          limit: limit,
        },
        {}
      );
    },
  };
}

export function useGetSubjectTypeList(
  {
    page,
    limit,
    filter,
  }: { page: number; limit: number; filter: { isActive?: boolean } },
  options?: UseQueryOptions<PaginatedResponse<SubjectTypeModel>>
): UseQueryResult<PaginatedResponse<SubjectTypeModel>> {
  return useQuery(getSubjectTypeList({ page, limit, filter }, options));
}

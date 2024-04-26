import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { SubjectMasterModel } from '../../domain/subject-master';
import { GET_SUBJECT_MASTER_LIST } from '../../endpoints';

function getSubjectMasterList(
  {
    page,
    limit,
    filter,
  }: {
    page: number;
    limit: number;
    filter: {
      isActive?: boolean;
    };
  },
  options?: UseQueryOptions<PaginatedResponse<SubjectMasterModel>>
): UseQueryOptions<PaginatedResponse<SubjectMasterModel>> {
  return {
    ...options,
    queryKey: [GET_SUBJECT_MASTER_LIST, page, limit, filter],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse<SubjectMasterModel>>(
        GET_SUBJECT_MASTER_LIST,
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

export function useGetSubjectMasterListQuery(
  {
    page,
    limit,
    filter,
  }: {
    page: number;
    limit: number;
    filter: {
      isActive?: boolean;
    };
  },
  options?: UseQueryOptions<PaginatedResponse<SubjectMasterModel>>
): UseQueryResult<PaginatedResponse<SubjectMasterModel>> {
  return useQuery(getSubjectMasterList({ page, limit, filter }, options));
}

import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { SubjectModel } from '../../domain/subject';
import { GET_SUBJECT_LIST } from '../../endpoints';

function getSubjectList(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions
): UseQueryOptions {
  return {
    ...options,
    queryKey: [GET_SUBJECT_LIST, page, limit],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse>(
        GET_SUBJECT_LIST,
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

export function useGetSubjectListQuery(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions
): UseQueryResult {
  return useQuery(getSubjectList({ page, limit }, options));
}

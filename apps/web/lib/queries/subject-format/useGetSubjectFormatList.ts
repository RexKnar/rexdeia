import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { SubjectFormatModel } from '../../domain/subject';
import { GET_SUBJECT_FORMAT_LIST } from '../../endpoints';

function getSubjectFormatList(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions<PaginatedResponse<SubjectFormatModel>>
): UseQueryOptions<PaginatedResponse<SubjectFormatModel>> {
  return {
    ...options,
    queryKey: [GET_SUBJECT_FORMAT_LIST, page, limit],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse<SubjectFormatModel>>(
        GET_SUBJECT_FORMAT_LIST,
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

export function useGetSubjectFormatList(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions<PaginatedResponse<SubjectFormatModel>>
): UseQueryResult<PaginatedResponse<SubjectFormatModel>> {
  return useQuery(getSubjectFormatList({ page, limit }, options));
}

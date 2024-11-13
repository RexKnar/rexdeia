import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { AssessmentFormatModel } from '../../domain/subject';
import { GET_ASSESSMENT_FORMAT_LIST } from '../../endpoints';

function getAssessmentFormatList(
  {
    page,
    limit,
    filter,
  }: {
    page: number;
    limit: number;
    filter: { isActive?: boolean; hasMarkEntry?: boolean };
  },
  options?: UseQueryOptions
): UseQueryOptions {
  return {
    ...options,
    queryKey: [GET_ASSESSMENT_FORMAT_LIST, page, limit],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse>(
        GET_ASSESSMENT_FORMAT_LIST,
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

export function useGetAssessmentFormatList(
  {
    page,
    limit,
    filter,
  }: { page: number; limit: number; filter: { isActive?: boolean } },
  options?: UseQueryOptions
): UseQueryResult {
  return useQuery(getAssessmentFormatList({ page, limit, filter }, options));
}

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
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions<PaginatedResponse<AssessmentFormatModel>>
): UseQueryOptions<PaginatedResponse<AssessmentFormatModel>> {
  return {
    ...options,
    queryKey: [GET_ASSESSMENT_FORMAT_LIST, page, limit],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse<AssessmentFormatModel>>(
        GET_ASSESSMENT_FORMAT_LIST,
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

export function useGetAssessmentFormatList(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions<PaginatedResponse<AssessmentFormatModel>>
): UseQueryResult<PaginatedResponse<AssessmentFormatModel>> {
  return useQuery(getAssessmentFormatList({ page, limit }, options));
}

import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { PaginatedResponse } from 'lib/domain';
import { InstituteCourseModel } from 'lib/domain/institute/course';
import { GET_INSTITUTE_COURSE_LIST } from 'lib/endpoints/institute/courseEndpoints';

function getInstituteCourseList(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions<PaginatedResponse<InstituteCourseModel>>
): UseQueryOptions<PaginatedResponse<InstituteCourseModel>> {
  return {
    ...options,
    queryKey: [GET_INSTITUTE_COURSE_LIST, page, limit],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse<InstituteCourseModel>>(
        GET_INSTITUTE_COURSE_LIST,
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

export function useGetInstituteCourseListQuery(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions<PaginatedResponse<InstituteCourseModel>>
): UseQueryResult<PaginatedResponse<InstituteCourseModel>> {
  return useQuery(getInstituteCourseList({ page, limit }, options));
}

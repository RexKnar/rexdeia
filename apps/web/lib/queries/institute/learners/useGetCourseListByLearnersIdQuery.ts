import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { PaginatedResponse } from 'lib/domain';
import { InstituteCourseModel } from 'lib/domain/institute/course';
import { GET_INSTITUTE_COURSE_LIST_BY_LEARNER_ID } from 'lib/endpoints/institute/courseEndpoints';

function getCourseListByLearnersId(
  {
    page,
    limit,
  }: {
    page: number;
    limit: number;
  },
  options?: UseQueryOptions<PaginatedResponse<InstituteCourseModel>>
): UseQueryOptions<PaginatedResponse<InstituteCourseModel>> {
  return {
    ...options,
    queryKey: [GET_INSTITUTE_COURSE_LIST_BY_LEARNER_ID, page, limit],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse<InstituteCourseModel>>(
        GET_INSTITUTE_COURSE_LIST_BY_LEARNER_ID,
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

export function useGetCourseListByLearnersIdQuery(
  {
    page,
    limit,
  }: {
    page: number;
    limit: number;
  },
  options?: UseQueryOptions<PaginatedResponse<InstituteCourseModel>>
): UseQueryResult<PaginatedResponse<InstituteCourseModel>> {
  return useQuery(getCourseListByLearnersId({ page, limit }, options));
}

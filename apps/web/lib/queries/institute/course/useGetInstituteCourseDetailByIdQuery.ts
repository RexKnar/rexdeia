import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { InstituteCourseModel } from 'lib/domain/institute/course';
import { GET_INSTITUTE_COURSE_BY_ID } from 'lib/endpoints/institute/courseEndpoints';

function getInstituteCourseDetailById(
  courseId: string,
  options?: UseQueryOptions<InstituteCourseModel>
): UseQueryOptions<InstituteCourseModel> {
  return {
    ...options,
    queryKey: [GET_INSTITUTE_COURSE_BY_ID],
    queryFn: async () => {
      return await makeAPICall<InstituteCourseModel>(
        GET_INSTITUTE_COURSE_BY_ID,
        {},
        {},
        { courseId }
      );
    },
  };
}

export function useGetInstituteCourseDetailByIdQuery(
  courseId: string,
  options?: UseQueryOptions<InstituteCourseModel>
): UseQueryResult<InstituteCourseModel> {
  return useQuery(getInstituteCourseDetailById(courseId, options));
}

import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { InstituteCourseModuleModel } from 'lib/domain/institute/module';
import { GET_INSTITUTE_COURSE_CONTENT_STRUCTURE } from 'lib/endpoints/institute/courseEndpoints';

function getCourseContentStructure(
  courseId: string,
  options?: Partial<UseQueryOptions<InstituteCourseModuleModel[]>>
): UseQueryOptions<InstituteCourseModuleModel[]> {
  return {
    ...options,
    queryKey: [GET_INSTITUTE_COURSE_CONTENT_STRUCTURE, courseId], // Add courseId to key for caching
    queryFn: async () => {
      return await makeAPICall<InstituteCourseModuleModel[]>(
        GET_INSTITUTE_COURSE_CONTENT_STRUCTURE,
        {},
        {},
        { courseId }
      );
    },
  };
}

export function useGetCourseContentStructureQuery(
  courseId: string,
  options?: Partial<UseQueryOptions<InstituteCourseModuleModel[]>>
): UseQueryResult<InstituteCourseModuleModel[]> {
  return useQuery<InstituteCourseModuleModel[]>(
    getCourseContentStructure(courseId, options)
  );
}

import { useQuery } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { InstituteCourseFAQModel } from 'lib/domain/institute/course';
import { GET_INSTITUTE_COURSE_FAQ } from 'lib/endpoints/institute/courseEndpoints';

export function useGetCourseFAQQuery(courseId: string) {
  return useQuery({
    queryKey: [GET_INSTITUTE_COURSE_FAQ, courseId],
    queryFn: async () => {
      return await makeAPICall<InstituteCourseFAQModel[]>(
        GET_INSTITUTE_COURSE_FAQ,
        {},
        {},
        { courseId }
      );
    },
    enabled: !!courseId,
  });
}

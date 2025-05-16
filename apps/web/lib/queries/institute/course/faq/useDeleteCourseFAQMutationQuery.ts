import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import {
  DELETE_INSTITUTE_COURSE_FAQ,
  GET_INSTITUTE_COURSE_FAQ,
} from 'lib/endpoints/institute/courseEndpoints';

export function useDeleteCourseFAQMutationQuery(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (faqId: string) => {
      const response = await makeAPICall(
        DELETE_INSTITUTE_COURSE_FAQ,
        {},
        {},
        { courseId, faqId }
      );

      await queryClient.invalidateQueries({
        queryKey: [GET_INSTITUTE_COURSE_FAQ, courseId],
      });

      return response;
    },
  });
}

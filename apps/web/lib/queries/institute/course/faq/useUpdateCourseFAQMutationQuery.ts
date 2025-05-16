import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import {
  InstituteCourseFAQModel,
  updateCourseFAQRequestModel,
} from 'lib/domain/institute/course';
import {
  GET_INSTITUTE_COURSE_FAQ,
  UPDATE_INSTITUTE_COURSE_FAQ,
} from 'lib/endpoints/institute/courseEndpoints';

export function useUpdateCourseFAQMutationQuery(
  courseId: string,
  faqId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (faqDetails: updateCourseFAQRequestModel) => {
      const response = await makeAPICall<InstituteCourseFAQModel>(
        UPDATE_INSTITUTE_COURSE_FAQ,
        faqDetails,
        {},
        { courseId, faqId }
      );

      await queryClient.invalidateQueries({
        queryKey: [GET_INSTITUTE_COURSE_FAQ, faqId, courseId],
      });

      return response;
    },

    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_INSTITUTE_COURSE_FAQ, faqId, courseId],
      });
    },
  });
}

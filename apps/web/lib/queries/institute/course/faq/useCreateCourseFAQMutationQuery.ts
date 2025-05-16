import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import {
  CreateCourseFAQRequestModel,
  InstituteCourseFAQModel,
} from 'lib/domain/institute/course';
import {
  CREATE_INSTITUTE_COURSE_FAQ,
  GET_INSTITUTE_COURSE_FAQ,
} from 'lib/endpoints/institute/courseEndpoints';

export function useCreateCourseFAQMutationQuery(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (faqDetails: CreateCourseFAQRequestModel) => {
      const response = await makeAPICall<InstituteCourseFAQModel>(
        CREATE_INSTITUTE_COURSE_FAQ,
        faqDetails,
        {},
        { courseId }
      );

      await queryClient.invalidateQueries({
        queryKey: [GET_INSTITUTE_COURSE_FAQ, courseId],
      });

      return response;
    },

    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_INSTITUTE_COURSE_FAQ, courseId],
      });
    },
  });
}

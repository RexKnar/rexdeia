import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import {
  InstituteCourseModel,
  UpdateInstituteCourseRequestModel,
} from 'lib/domain/institute/course';
import {
  GET_INSTITUTE_COURSE_BY_ID,
  UPDATE_INSTITUTE_COURSE,
} from 'lib/endpoints/institute/courseEndpoints';

export function useUpdateCourseMutationQuery(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (courseDetails: UpdateInstituteCourseRequestModel) => {
      const response = await makeAPICall<InstituteCourseModel>(
        UPDATE_INSTITUTE_COURSE,
        courseDetails,
        {},
        { courseId }
      );
      await queryClient.invalidateQueries({
        queryKey: [GET_INSTITUTE_COURSE_BY_ID, courseId],
      });

      return response;
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_INSTITUTE_COURSE_BY_ID, courseId],
      });
    },
  });
}

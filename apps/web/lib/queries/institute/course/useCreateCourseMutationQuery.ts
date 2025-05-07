import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import {
  CreateCourseRequestModel,
  InstituteCourseModel,
} from 'lib/domain/institute/course';
import {
  CREATE_INSTITUTE_COURSE,
  GET_INSTITUTE_COURSE_LIST,
} from 'lib/endpoints/institute/courseEndpoints';

export function useCreateCourseMutationQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (courseDetails: CreateCourseRequestModel) => {
      const response = await makeAPICall<InstituteCourseModel>(
        CREATE_INSTITUTE_COURSE,
        courseDetails,
        {},
        {}
      );
      await queryClient.invalidateQueries({
        queryKey: [GET_INSTITUTE_COURSE_LIST],
      });

      return response;
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_INSTITUTE_COURSE_LIST],
      });
    },
  });
}

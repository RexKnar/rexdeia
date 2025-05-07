import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import {
  CreateCourseModuleRequestModel,
  InstituteCourseModuleModel,
} from 'lib/domain/institute/module';
import {
  CREATE_INSTITUTE_COURSE_MODULE,
  GET_INSTITUTE_COURSE_CONTENT_STRUCTURE,
} from 'lib/endpoints/institute/courseEndpoints';

export function useCreateCourseModuleMutationQuery(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (courseModuleDetails: CreateCourseModuleRequestModel) => {
      const response = await makeAPICall<InstituteCourseModuleModel>(
        CREATE_INSTITUTE_COURSE_MODULE,
        courseModuleDetails,
        {},
        { courseId }
      );
      await queryClient.invalidateQueries({
        queryKey: [GET_INSTITUTE_COURSE_CONTENT_STRUCTURE],
      });

      return response;
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_INSTITUTE_COURSE_CONTENT_STRUCTURE],
      });
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import {
  InstituteCourseModuleModel,
  UpdateCourseModuleRequestModel,
} from 'lib/domain/institute/module';
import {
  GET_INSTITUTE_COURSE_CONTENT_STRUCTURE,
  UPDATE_INSTITUTE_COURSE_MODULE,
} from 'lib/endpoints/institute/courseEndpoints';

export function useUpdateCourseModuleMutationQuery(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateCourseModuleRequestModel) => {
      const response = await makeAPICall<InstituteCourseModuleModel>(
        UPDATE_INSTITUTE_COURSE_MODULE,
        payload,
        {},
        {
          courseId,
          moduleId: payload.id,
        }
      );

      return response;
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_INSTITUTE_COURSE_CONTENT_STRUCTURE],
      });
    },
  });
}

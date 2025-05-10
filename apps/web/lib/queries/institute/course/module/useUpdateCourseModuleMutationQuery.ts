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

export function useUpdateCourseModuleMutationQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateCourseModuleRequestModel) => {
      const response = await makeAPICall<InstituteCourseModuleModel>(
        UPDATE_INSTITUTE_COURSE_MODULE,
        payload,
        {},
        { id: payload.id }
      );
      await queryClient.refetchQueries({
        queryKey: [GET_INSTITUTE_COURSE_CONTENT_STRUCTURE],
      });

      return response;
    },
  });
}

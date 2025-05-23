import { useMutation } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { InstituteCourseModuleModel } from 'lib/domain/institute/module';
import { DELETE_INSTITUTE_COURSE_MODULE_BY_ID } from 'lib/endpoints/institute/courseEndpoints';

export function useDeleteModuleMutation() {
  return useMutation({
    mutationKey: ['deleteModule'],
    mutationFn: async ({
      courseId,
      moduleId,
    }: {
      courseId: string;
      moduleId: string;
    }) => {
      return await makeAPICall<InstituteCourseModuleModel>(
        DELETE_INSTITUTE_COURSE_MODULE_BY_ID,
        {},
        {},
        { courseId, moduleId }
      );
    },
  });
}

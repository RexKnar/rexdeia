import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import {
  CreateCourseChapterRequestModel,
  InstituteCourseChapterModel,
} from 'lib/domain/institute/chapter';
import {
  CREATE_INSTITUTE_COURSE_CHAPTER,
  GET_INSTITUTE_COURSE_CONTENT_STRUCTURE,
} from 'lib/endpoints/institute/courseEndpoints';

export function useCreateCourseChapterMutationQuery(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      courseChapterDetails: CreateCourseChapterRequestModel
    ) => {
      const response = await makeAPICall<InstituteCourseChapterModel>(
        CREATE_INSTITUTE_COURSE_CHAPTER,
        courseChapterDetails,
        {},
        { courseId, moduleId: courseChapterDetails?.moduleId }
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

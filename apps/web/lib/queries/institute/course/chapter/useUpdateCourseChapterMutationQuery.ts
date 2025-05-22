import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import {
  InstituteCourseChapterModel,
  UpdateCourseChapterRequestModel,
} from 'lib/domain/institute/chapter';
import {
  GET_INSTITUTE_COURSE_CONTENT_STRUCTURE,
  UPDATE_INSTITUTE_COURSE_CHAPTER,
} from 'lib/endpoints/institute/courseEndpoints';

export function useUpdateCourseChapterMutationQuery(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      courseChapterDetails: UpdateCourseChapterRequestModel
    ) => {
      const response = await makeAPICall<InstituteCourseChapterModel>(
        UPDATE_INSTITUTE_COURSE_CHAPTER,
        courseChapterDetails,
        {},
        {
          courseId,
          chapterId: courseChapterDetails?.id,
        }
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

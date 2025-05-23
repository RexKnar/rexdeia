import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import {
  CreateCourseChapterItemRequestModel,
  InstituteCourseChapterItemModel,
} from 'lib/domain/institute/chapterItem';
import {
  CREATE_INSTITUTE_COURSE_CHAPTER_ITEM,
  GET_INSTITUTE_COURSE_CONTENT_STRUCTURE,
} from 'lib/endpoints/institute/courseEndpoints';

export function useCreateChapterItemMutationQuery(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      courseChapterItemDetails: CreateCourseChapterItemRequestModel
    ) => {
      const response = await makeAPICall<InstituteCourseChapterItemModel>(
        CREATE_INSTITUTE_COURSE_CHAPTER_ITEM,
        courseChapterItemDetails,
        {},
        {
          courseId,
          chapterId: courseChapterItemDetails?.chapterId,
          moduleId: courseId,
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

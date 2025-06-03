import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import {
  InstituteCourseChapterItemModel,
  UpdateCourseChapterItemRequestModel,
} from 'lib/domain/institute/chapterItem';
import {
  GET_INSTITUTE_COURSE_CHAPTER_ITEM_BY_ID,
  GET_INSTITUTE_COURSE_CONTENT_STRUCTURE,
  UPDATE_INSTITUTE_COURSE_CHAPTER_ITEM,
} from 'lib/endpoints/institute/courseEndpoints';

export function useUpdateChapterItemMutationQuery(itemId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateCourseChapterItemRequestModel) => {
      const response = await makeAPICall<InstituteCourseChapterItemModel>(
        UPDATE_INSTITUTE_COURSE_CHAPTER_ITEM,
        payload,
        {},
        { itemId, courseId: itemId, chapterId: itemId, moduleId: itemId }
      );
      await queryClient.refetchQueries({
        queryKey: [GET_INSTITUTE_COURSE_CHAPTER_ITEM_BY_ID, itemId],
      });
      await queryClient.invalidateQueries({
        queryKey: [GET_INSTITUTE_COURSE_CONTENT_STRUCTURE],
      });

      return response;
    },
  });
}

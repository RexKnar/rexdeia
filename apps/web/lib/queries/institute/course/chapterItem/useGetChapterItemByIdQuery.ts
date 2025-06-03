import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { InstituteCourseChapterItemModel } from 'lib/domain/institute/chapterItem';
import { GET_INSTITUTE_COURSE_CHAPTER_ITEM_BY_ID } from 'lib/endpoints/institute/courseEndpoints';

function getChapterItemById(
  itemId: string,
  options?: Partial<UseQueryOptions<InstituteCourseChapterItemModel>>
): UseQueryOptions<InstituteCourseChapterItemModel> {
  return {
    ...options,
    queryKey: [GET_INSTITUTE_COURSE_CHAPTER_ITEM_BY_ID, itemId],
    queryFn: async () => {
      return await makeAPICall<InstituteCourseChapterItemModel>(
        GET_INSTITUTE_COURSE_CHAPTER_ITEM_BY_ID,
        {},
        {},
        { itemId, courseId: itemId, chapterId: itemId, moduleId: itemId }
      );
    },
  };
}
export function useGetChapterItemByIdQuery(
  id: string,
  options?: Partial<UseQueryOptions<InstituteCourseChapterItemModel>>
): UseQueryResult<InstituteCourseChapterItemModel> {
  return useQuery(getChapterItemById(id, options));
}

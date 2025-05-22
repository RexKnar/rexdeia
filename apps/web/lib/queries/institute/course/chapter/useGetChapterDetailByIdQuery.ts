import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { InstituteCourseChapterModel } from 'lib/domain/institute/chapter';
import { GET_INSTITUTE_COURSE_CHAPTER_BY_ID } from 'lib/endpoints/institute/courseEndpoints';

function getChapterDetailById(
  chapterId: string,
  options?: Partial<UseQueryOptions<InstituteCourseChapterModel>>
) {
  return {
    ...options,
    queryKey: [GET_INSTITUTE_COURSE_CHAPTER_BY_ID],
    queryFn: async () => {
      return await makeAPICall<InstituteCourseChapterModel>(
        GET_INSTITUTE_COURSE_CHAPTER_BY_ID,
        {},
        {},
        { chapterId }
      );
    },
  };
}

export function useGetChapterDetailByIdQuery(
  chapterId: string,
  options?: Partial<UseQueryOptions<InstituteCourseChapterModel>>
): UseQueryResult<InstituteCourseChapterModel> {
  return useQuery(getChapterDetailById(chapterId, options));
}

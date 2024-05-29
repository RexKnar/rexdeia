import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { SectionModel } from '../../domain/section';
import { GET_SECTION_BY_CLASS_GROUP } from '../../endpoints';

function getSectionsByClassIdSubjectIdQuery(
  { classId, subjectId }: { classId: string; subjectId: string },
  options?: Partial<UseQueryOptions<SectionModel[]>>
): UseQueryOptions<SectionModel[]> {
  return {
    ...options,
    queryKey: [GET_SECTION_BY_CLASS_GROUP, classId, subjectId],
    queryFn: async () => {
      return await makeAPICall<SectionModel[]>(
        GET_SECTION_BY_CLASS_GROUP,
        { classId, subjectId },
        {},
        {}
      );
    },
  };
}
export function useGetSectionsByClassIdSubjectIdQuery(
  { classId, subjectId }: { classId: string; subjectId: string },
  options?: Partial<UseQueryOptions<SectionModel[]>>
): UseQueryResult<SectionModel[]> {
  return useQuery(
    getSectionsByClassIdSubjectIdQuery({ classId, subjectId }, options)
  );
}

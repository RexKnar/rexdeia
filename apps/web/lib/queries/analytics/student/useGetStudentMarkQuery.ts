import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { StudentsMarksForAnalytics } from 'lib/domain/analytics';
import { EXAM_MARK_LIST_BY_STUDENT_ID } from 'lib/endpoints/examAnalyticsEndpoints';

function getStudentMarkListQuery(
  id: string,
  sectionId: string,
  classId?: string,
  groupId?: string,
  options?: Partial<UseQueryOptions<any>>
) {
  return {
    ...options,
    queryKey: [EXAM_MARK_LIST_BY_STUDENT_ID, id],
    queryFn: async () => {
      return await makeAPICall<StudentsMarksForAnalytics[]>(
        EXAM_MARK_LIST_BY_STUDENT_ID,
        {},
        { sectionId, groupId, classId },
        { id }
      );
    },
  };
}

export function useGetStudentMarkListQuery(
  id: string,
  sectionId: string,
  classId?: string,
  groupId?: string,
  options?: Partial<UseQueryOptions<any>>
) {
  return useQuery(
    getStudentMarkListQuery(id, sectionId, classId, groupId, options)
  );
}

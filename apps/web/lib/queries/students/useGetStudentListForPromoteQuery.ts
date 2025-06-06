import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { Student } from '../../domain';
import { GET_STUDENT_LIST_FOR_PROMOTE } from '../../endpoints';

function getStudentListForPromoteQuery(
  classId: string,
  sectionId: string,
  groupId: string,
  status: string,
  options?: Partial<UseQueryOptions<Student[]>>
) {
  return {
    ...options,
    queryKey: [
      GET_STUDENT_LIST_FOR_PROMOTE,
      classId,
      sectionId,
      groupId,
      status,
    ],
    queryFn: async () => {
      return await makeAPICall<Student[]>(
        GET_STUDENT_LIST_FOR_PROMOTE,
        { classId, sectionId, groupId, status },
        {},
        {}
      );
    },
  };
}

export function useGetStudentListForPromoteQuery(
  classId: string,
  sectionId: string,
  groupId: string,
  status: string,
  options?: Partial<UseQueryOptions<Student[]>>
) {
  return useQuery(
    getStudentListForPromoteQuery(classId, sectionId, groupId, status, options)
  );
}

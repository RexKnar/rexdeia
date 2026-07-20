import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { Student } from '../../domain';
import { GET_STUDENTS_LIST_FOR_ASSIGN } from '../../endpoints';

function getStudentListByClassId(
  id: string,
  groupId: string,
  includeArchived: boolean,
  options?: Partial<UseQueryOptions<Student[]>>
) {
  return {
    ...options,
    queryKey: [GET_STUDENTS_LIST_FOR_ASSIGN, id, includeArchived],
    queryFn: async () => {
      return await makeAPICall<Student[]>(
        GET_STUDENTS_LIST_FOR_ASSIGN,
        { groupId: groupId },
        { includeArchived },
        { id }
      );
    },
  };
}

export function useGetStudentListForAssignQuery(
  id: string,
  groupId: string,
  includeArchived: boolean,
  options?: Partial<UseQueryOptions<Student[]>>
) {
  return useQuery(getStudentListByClassId(id, groupId, includeArchived, options));
}


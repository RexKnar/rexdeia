import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { Student } from '../../domain';
import { GET_STUDENT_LIST_BY_CLASS_ID } from '../../endpoints';

function getStudentListByClassId(
  id: string,
  options?: Partial<UseQueryOptions<Student[]>>
) {
  return {
    ...options,
    queryKey: [GET_STUDENT_LIST_BY_CLASS_ID, id],
    queryFn: async () => {
      return await makeAPICall<Student[]>(
        GET_STUDENT_LIST_BY_CLASS_ID,
        {},
        {},
        { id }
      );
    },
  };
}

export function useGetStudentListByClassIdQuery(
  id: string,
  options?: Partial<UseQueryOptions<Student[]>>
) {
  return useQuery(getStudentListByClassId(id, options));
}

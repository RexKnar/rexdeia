import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { Student } from '../../domain';
import { GET_STUDENT_LIST_BY_SECTION_ID } from '../../endpoints';

function getStudentListBySectionId(
  id: string,
  options?: Partial<UseQueryOptions<Student[]>>
) {
  return {
    ...options,
    queryKey: [GET_STUDENT_LIST_BY_SECTION_ID, id],
    queryFn: async () => {
      return await makeAPICall<Student[]>(
        GET_STUDENT_LIST_BY_SECTION_ID,
        {},
        {},
        { id }
      );
    },
  };
}

export function useGetStudentListBySectionIdQuery(
  id: string,
  options?: Partial<UseQueryOptions<Student[]>>
) {
  return useQuery(getStudentListBySectionId(id, options));
}

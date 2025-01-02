import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { GET_STUDENT_HISTORY_LIST_BY_ID } from '../../endpoints';

function getStudentHistoryListById(
  id: string,
  options?: Partial<UseQueryOptions<any[]>>
) {
  return {
    ...options,
    queryKey: [GET_STUDENT_HISTORY_LIST_BY_ID, id],
    queryFn: async () => {
      return await makeAPICall<any[]>(
        GET_STUDENT_HISTORY_LIST_BY_ID,
        {},
        {},
        { id }
      );
    },
  };
}

export function useGetStudentHistoryListByIdQuery(
  id: string,
  options?: Partial<UseQueryOptions<any[]>>
) {
  return useQuery(getStudentHistoryListById(id, options));
}

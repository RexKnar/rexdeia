import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { makeAPICall } from '../api';
import { Student } from '../domain';
import { GET_STUDENTDETAILS_BY_ID } from '../endpoints';

export function useGetStudentDetailsByIdQuery(
  studentId: string,
  options?: UseQueryOptions<Student[]>
) {
  return useQuery({
    ...options,
    queryKey: [GET_STUDENTDETAILS_BY_ID],
    queryFn: async () => {
      return await makeAPICall<Student[]>(
        GET_STUDENTDETAILS_BY_ID,
        {},
        { format: 'form' },
        { studentId: studentId }
      );
    },
  });
}

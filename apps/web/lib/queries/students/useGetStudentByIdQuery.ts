import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { Student } from '../../domain/student';
import { GET_STUDENT_BY_ID } from '../../endpoints';

function getStudentById(studentId: string, options?: Partial): UseQueryOptions {
  return {
    ...options,
    queryKey: [GET_STUDENT_BY_ID, studentId],
    queryFn: async () => {
      return await makeAPICall<Student>(
        GET_STUDENT_BY_ID,
        {},
        {},
        { id: studentId }
      );
    },
  };
}
export function useGetStudentByIdQuery(
  studentId: string,
  options?: Partial
): UseQueryResult {
  return useQuery(getStudentById(studentId, options));
}

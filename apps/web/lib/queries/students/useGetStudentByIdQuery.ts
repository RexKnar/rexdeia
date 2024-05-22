import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { GetStudentModel } from '../../domain/student';
import { GET_STUDENT_BY_ID } from '../../endpoints';

function getStudentById(
  studentId: string,
  options?: Partial<UseQueryOptions<GetStudentModel>>
): UseQueryOptions<GetStudentModel> {
  return {
    ...options,
    queryKey: [GET_STUDENT_BY_ID, studentId],
    queryFn: async () => {
      return await makeAPICall<GetStudentModel>(
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
  options?: Partial<UseQueryOptions<GetStudentModel>>
): UseQueryResult<GetStudentModel> {
  return useQuery(getStudentById(studentId, options));
}

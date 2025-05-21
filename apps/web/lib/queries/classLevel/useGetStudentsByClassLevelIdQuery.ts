import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { Student } from 'lib/domain/student';

import { makeAPICall } from '../../api';
import { GET_STUDENTS_BY_CLASSLEVEL_ID } from '../../endpoints';

function getStudentsByClassLevelId(
  id: string,
  options?: Partial<UseQueryOptions<Student[]>>
): UseQueryOptions<Student[]> {
  return {
    ...options,
    queryKey: [GET_STUDENTS_BY_CLASSLEVEL_ID, id],
    queryFn: async () => {
      return await makeAPICall<Student[]>(
        GET_STUDENTS_BY_CLASSLEVEL_ID,
        {},
        {},
        { id }
      );
    },
  };
}

export function useGetStudentsByClassLevelIdQuery(
  id: string,
  options?: Partial<UseQueryOptions<Student[]>>
): UseQueryResult<Student[]> {
  return useQuery(getStudentsByClassLevelId(id, options));
}

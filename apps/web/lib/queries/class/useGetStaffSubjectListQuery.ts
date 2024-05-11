import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { ClassModel } from '../../domain/class';
import { GET_CLASS_BY_ID } from '../../endpoints';

function getStaffSubjectListByClassId(
  classId: string,
  options?: Partial<UseQueryOptions<ClassModel>>
): UseQueryOptions<ClassModel> {
  return {
    ...options,
    queryKey: [GET_CLASS_BY_ID, classId],
    queryFn: async () => {
      return await makeAPICall<ClassModel>(
        GET_CLASS_BY_ID,
        {},
        {},
        { id: classId }
      );
    },
  };
}
export function useGetClassByIdQuery(
  id: string,
  options?: Partial<UseQueryOptions<ClassModel>>
): UseQueryResult<ClassModel> {
  return useQuery(getStaffSubjectListByClassId(id, options));
}

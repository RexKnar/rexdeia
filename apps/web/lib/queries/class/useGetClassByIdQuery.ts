import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { ClassModel } from '../../domain/class';
import { GET_CLASS_BY_ID } from '../../endpoints';

function getClassById(classId: string, options?: Partial): UseQueryOptions {
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
  options?: Partial
): UseQueryResult {
  return useQuery(getClassById(id, options));
}

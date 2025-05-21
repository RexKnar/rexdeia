import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { ClassModel } from 'lib/domain/class';

import { makeAPICall } from '../../api';
import { GET_CLASSES_BY_CLASSLEVEL_ID } from '../../endpoints';

function getClassListByClassLevelId(
  id: string,
  options?: Partial<UseQueryOptions<ClassModel[]>>
): UseQueryOptions<ClassModel[]> {
  return {
    ...options,
    queryKey: [GET_CLASSES_BY_CLASSLEVEL_ID, id],
    queryFn: async () => {
      return await makeAPICall<ClassModel[]>(
        GET_CLASSES_BY_CLASSLEVEL_ID,
        {},
        {},
        { id }
      );
    },
  };
}

export function useGetClassListByClassLevelIdQuery(
  id: string,
  options?: Partial<UseQueryOptions<ClassModel[]>>
): UseQueryResult<ClassModel[]> {
  return useQuery(getClassListByClassLevelId(id, options));
}

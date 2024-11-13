import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { ClassLevelModel } from 'lib/domain/classLevel';

import { makeAPICall } from '../../api';
import { GET_CLASSLEVEL_BY_ID } from '../../endpoints';

function getClassLevelById(id: string, options?: Partial): UseQueryOptions {
  return {
    ...options,
    queryKey: [GET_CLASSLEVEL_BY_ID, id],
    queryFn: async () => {
      return await makeAPICall<ClassLevelModel>(
        GET_CLASSLEVEL_BY_ID,
        {},
        {},
        { id }
      );
    },
  };
}
export function useGetClassLevelByIdQuery(
  id: string,
  options?: Partial
): UseQueryResult {
  return useQuery(getClassLevelById(id, options));
}

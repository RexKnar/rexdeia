import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { ClassLevelModel } from 'lib/domain/classLevel';

import { makeAPICall } from '../../api';
import { GET_CLASSLEVELS_LIST } from '../../endpoints';

function getClassLevelList(
  options?: UseQueryOptions<ClassLevelModel[]>
): UseQueryOptions<ClassLevelModel[]> {
  return {
    ...options,
    queryKey: [GET_CLASSLEVELS_LIST],
    queryFn: async () => {
      return await makeAPICall<ClassLevelModel[]>(
        GET_CLASSLEVELS_LIST,

        {},
        {}
      );
    },
  };
}

export function useGetClassLevelListQuery(
  options?: UseQueryOptions<ClassLevelModel[]>
): UseQueryResult<ClassLevelModel[]> {
  return useQuery(getClassLevelList(options));
}

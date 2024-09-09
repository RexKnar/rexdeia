import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { ClassLevelModel } from 'lib/domain/classLevel';

import { makeAPICall } from '../../api';
import { GET_CLASSLEVELS_LIST } from '../../endpoints';

function getClassLevelList(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions<ClassLevelModel[]>
): UseQueryOptions<ClassLevelModel[]> {
  return {
    ...options,
    queryKey: [GET_CLASSLEVELS_LIST, page, limit],
    queryFn: async () => {
      return await makeAPICall<ClassLevelModel[]>(
        GET_CLASSLEVELS_LIST,
        {
          page: page,
          limit: limit,
        },
        {}
      );
    },
  };
}

export function useGetClassLevelListQuery(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions<ClassLevelModel[]>
): UseQueryResult<ClassLevelModel[]> {
  return useQuery(getClassLevelList({ page, limit }, options));
}

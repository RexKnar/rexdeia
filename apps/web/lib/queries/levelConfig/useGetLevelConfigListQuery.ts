import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { LevelConfigModel } from 'lib/domain/levelConfig';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { GET_LEVELCONFIG_LIST } from '../../endpoints';

function getLevelConfigList(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions
): UseQueryOptions {
  return {
    ...options,
    queryKey: [GET_LEVELCONFIG_LIST, page, limit],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse>(
        GET_LEVELCONFIG_LIST,
        {},
        {
          page: page,
          limit: limit,
        },
        {}
      );
    },
  };
}

export function useGetLevelConfigListQuery(
  { page, limit }: { page: number; limit: number },
  options?: UseQueryOptions
): UseQueryResult {
  return useQuery(getLevelConfigList({ page, limit }, options));
}

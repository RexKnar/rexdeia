import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { LevelConfigModel } from 'lib/domain/levelConfig';

import { makeAPICall } from '../../api';
import { GET_LEVELCONFIG_BY_ID } from '../../endpoints';

function getLevelConfigById(
  Id: string,
  options?: Partial<UseQueryOptions<LevelConfigModel>>
): UseQueryOptions<LevelConfigModel> {
  return {
    ...options,
    queryKey: [GET_LEVELCONFIG_BY_ID, Id],
    queryFn: async () => {
      return await makeAPICall<LevelConfigModel>(
        GET_LEVELCONFIG_BY_ID,
        {},
        {},
        { Id }
      );
    },
  };
}
export function useGetLevelConfigByIdQuery(
  id: string,
  options?: Partial<UseQueryOptions<LevelConfigModel>>
): UseQueryResult<LevelConfigModel> {
  return useQuery(getLevelConfigById(id, options));
}

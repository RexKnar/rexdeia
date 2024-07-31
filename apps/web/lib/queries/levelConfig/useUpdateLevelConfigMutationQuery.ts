import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  LevelConfigModel,
  UpdateLevelConfigModel,
} from 'lib/domain/levelConfig';

import { makeAPICall } from '../../api';
import {
  GET_LEVELCONFIG_LIST,
  UPDATE_LEVELCONFIG_BY_ID,
} from '../../endpoints';

export function useUpdateLevelConfigMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateLevelConfigModel) => {
      const response = await makeAPICall<LevelConfigModel>(
        UPDATE_LEVELCONFIG_BY_ID,
        payload,
        {},
        { id: payload.id }
      );

      await queryClient.refetchQueries({
        queryKey: [GET_LEVELCONFIG_LIST, page, limit],
      });

      return response;
    },
  });
}

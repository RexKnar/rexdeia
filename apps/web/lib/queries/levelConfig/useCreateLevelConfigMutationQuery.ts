import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CreateLevelConfigModel,
  LevelConfigModel,
} from 'lib/domain/levelConfig';
import { ADD_LEVELCONFIG, GET_LEVELCONFIG_LIST } from 'lib/endpoints';

import { makeAPICall } from '../../api';

export function useCreateLevelConfigMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateLevelConfigModel) => {
      const response = await makeAPICall<LevelConfigModel>(
        ADD_LEVELCONFIG,
        payload,
        {},
        {}
      );
      await queryClient.refetchQueries({
        queryKey: [GET_LEVELCONFIG_LIST, page, limit],
      });

      return response;
    },
  });
}

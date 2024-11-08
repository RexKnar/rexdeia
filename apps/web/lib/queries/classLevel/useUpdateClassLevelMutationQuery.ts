import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ClassLevelModel, UpdateClassLevelModel } from 'lib/domain/classLevel';

import { makeAPICall } from '../../api';
import { GET_CLASSLEVELS_LIST, UPDATE_CLASSLEVEL_BY_ID } from '../../endpoints';

export function useUpdateClassLevelMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateClassLevelModel) => {
      const response = await makeAPICall<ClassLevelModel>(
        UPDATE_CLASSLEVEL_BY_ID,
        payload,
        {},
        { id: payload.id }
      );

      await queryClient.refetchQueries({
        queryKey: [GET_CLASSLEVELS_LIST, page, limit],
      });

      return response;
    },
  });
}

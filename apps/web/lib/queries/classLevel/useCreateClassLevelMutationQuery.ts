import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ClassLevelModel, CreateClassLevelModel } from 'lib/domain/classLevel';
import { ADD_CLASSLEVEL, GET_CLASSLEVELS_LIST } from 'lib/endpoints';

import { makeAPICall } from '../../api';

export function useCreateClassLevelMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateClassLevelModel) => {
      const response = await makeAPICall<ClassLevelModel>(
        ADD_CLASSLEVEL,
        payload,
        {},
        {}
      );
      await queryClient.refetchQueries({
        queryKey: [GET_CLASSLEVELS_LIST, page, limit],
      });

      return response;
    },
  });
}

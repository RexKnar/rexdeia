import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreatePeriodTypeModel, PeriodTypeModel } from 'lib/domain/periodsType';
import { ADD_PERIOD_TYPE, GET_PERIOD_TYPES_LIST } from 'lib/endpoints';

import { makeAPICall } from '../../api';

export function useCreatePeriodTypeMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePeriodTypeModel) => {
      const response = await makeAPICall<PeriodTypeModel>(
        ADD_PERIOD_TYPE,
        payload,
        {},
        {}
      );
      await queryClient.refetchQueries({
        queryKey: [GET_PERIOD_TYPES_LIST, page, limit],
      });

      return response;
    },
  });
}

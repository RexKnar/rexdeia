import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PeriodTypeModel, UpdatePeriodTypeModel } from 'lib/domain/periodsType';
import { GET_PERIOD_TYPES_LIST, UPDATE_PERIOD_TYPE_BY_ID } from 'lib/endpoints';

import { makeAPICall } from '../../api';

export function useUpdatePeriodTypeMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdatePeriodTypeModel) => {
      const response = await makeAPICall<PeriodTypeModel>(
        UPDATE_PERIOD_TYPE_BY_ID,
        payload,
        {},
        { id: payload.id }
      );
      await queryClient.refetchQueries({
        queryKey: [GET_PERIOD_TYPES_LIST, page, limit],
      });

      return response;
    },
  });
}

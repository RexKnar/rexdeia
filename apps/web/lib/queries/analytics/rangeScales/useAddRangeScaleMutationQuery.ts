import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import {
  CreateRangeScale,
  RangeScaleModel,
} from 'lib/domain/analytics/rangeAnalytics';
import {
  ADD_RANGE_SCALES,
  GET_RANGE_SCALES,
} from 'lib/endpoints/examAnalyticsEndpoints';

export function useAddRangeScaleMutationQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateRangeScale[]) => {
      const response = await makeAPICall<RangeScaleModel[]>(
        ADD_RANGE_SCALES,
        { data: payload },
        {},
        {}
      );
      await queryClient.refetchQueries({
        queryKey: [GET_RANGE_SCALES, 'All'],
      });

      return response;
    },
  });
}

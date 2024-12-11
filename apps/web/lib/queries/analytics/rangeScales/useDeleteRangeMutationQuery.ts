import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import {
  DELETE_RANGE_BY_ID,
  GET_RANGE_SCALES,
} from 'lib/endpoints/examAnalyticsEndpoints';

export function useDeleteRangeMutationQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await makeAPICall<unknown>(
        DELETE_RANGE_BY_ID,
        {},
        {},
        { id }
      );
      await queryClient.refetchQueries({
        queryKey: [GET_RANGE_SCALES, 'All'],
      });

      return response;
    },
  });
}

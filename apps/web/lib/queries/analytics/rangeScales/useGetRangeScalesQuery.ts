import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { GetRangeScales } from 'lib/domain/analytics/rangeAnalytics';
import { GET_RANGE_SCALES } from 'lib/endpoints/examAnalyticsEndpoints';

function getRangeScales(
  rangeType: string,
  options?: Partial<UseQueryOptions<GetRangeScales[]>>
) {
  return {
    ...options,
    queryKey: [GET_RANGE_SCALES, rangeType],
    queryFn: async () => {
      return await makeAPICall<GetRangeScales[]>(
        GET_RANGE_SCALES,
        {},
        { rangeType },
        {}
      );
    },
  };
}

export function useGetRangeScalesQuery(
  rangeType: string,
  options?: Partial<UseQueryOptions<GetRangeScales[]>>
) {
  return useQuery(getRangeScales(rangeType, options));
}

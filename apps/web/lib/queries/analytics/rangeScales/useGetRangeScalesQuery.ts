import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { GetRangeScales } from 'lib/domain/analytics/rangeAnalytics';
import { GET_RANGE_SCALES } from 'lib/endpoints/examAnalyticsEndpoints';

function getRangeScales(
  { rangeType, classId }: { rangeType: string; classId?: string },
  options?: Partial<UseQueryOptions<GetRangeScales[]>>
) {
  const filter = classId ? { rangeType, classId } : { rangeType };
  return {
    ...options,
    queryKey: [GET_RANGE_SCALES, rangeType],
    queryFn: async () => {
      return await makeAPICall<GetRangeScales[]>(
        GET_RANGE_SCALES,
        {},
        filter,
        {}
      );
    },
  };
}

export function useGetRangeScalesQuery(
  filter: { rangeType: string; classId?: string },
  options?: Partial<UseQueryOptions<GetRangeScales[]>>
) {
  return useQuery(getRangeScales(filter, options));
}

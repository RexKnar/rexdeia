import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { GetRangeScales } from 'lib/domain/analytics/rangeAnalytics';
import { GET_RANGE_SCALES } from 'lib/endpoints/examAnalyticsEndpoints';

interface RangeScaleFilter {
  rangeType: string;
  classId?: string;
  academicYearId?: string;
}

const getRangeScales = async (filter: RangeScaleFilter) => {
  const queryParams: Record<string, string> = {
    rangeType: filter.rangeType,
  };

  if (filter.classId) queryParams.classId = filter.classId;
  if (filter.academicYearId) queryParams.academicYearId = filter.academicYearId;

  return await makeAPICall<GetRangeScales[]>(
    GET_RANGE_SCALES,
    {},
    queryParams,
    {}
  );
};

export function useGetRangeScalesQuery(
  filter: RangeScaleFilter,
  options?: Partial<UseQueryOptions<GetRangeScales[]>>
) {
  return useQuery<GetRangeScales[]>({
    queryKey: [
      GET_RANGE_SCALES,
      filter.rangeType,
      filter.classId ?? null,
      filter.academicYearId ?? null,
    ],
    queryFn: () => getRangeScales(filter),
    enabled: !!filter.rangeType,
    ...options,
  });
}

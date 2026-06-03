import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { PeriodStatsData, PeriodStatsScope } from 'lib/domain/timetable';

import { makeAPICall } from '../../api';
import { GET_PERIOD_STATS } from '../../endpoints';

export function useGetPeriodStatsQuery(
  {
    scope,
    id,
    from,
    to,
  }: {
    scope: PeriodStatsScope;
    id: string;
    from: string;
    to: string;
  },
  options?: Partial<UseQueryOptions<PeriodStatsData>>
) {
  return useQuery({
    ...options,
    queryKey: [GET_PERIOD_STATS, scope, id, from, to],
    queryFn: async () =>
      makeAPICall<PeriodStatsData>(
        GET_PERIOD_STATS,
        {},
        { scope, id, from, to },
        {}
      ),
  });
}

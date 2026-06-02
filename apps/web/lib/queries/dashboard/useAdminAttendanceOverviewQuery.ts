import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { GET_ADMIN_ATTENDANCE_OVERVIEW } from '../../endpoints';
import { AdminAttendanceOverview } from './types';

export function useAdminAttendanceOverviewQuery(
  { date, session }: { date: string; session: 'morning' | 'afternoon' },
  options?: Partial<UseQueryOptions<AdminAttendanceOverview>>
) {
  return useQuery({
    ...options,
    queryKey: [GET_ADMIN_ATTENDANCE_OVERVIEW, date, session],
    queryFn: async () =>
      makeAPICall<AdminAttendanceOverview>(
        GET_ADMIN_ATTENDANCE_OVERVIEW,
        {},
        { date, session },
        {}
      ),
  });
}

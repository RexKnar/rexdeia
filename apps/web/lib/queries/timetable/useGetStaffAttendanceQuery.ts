import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { StaffAttendanceDayData } from 'lib/domain/timetable';

import { makeAPICall } from '../../api';
import { GET_STAFF_ATTENDANCE } from '../../endpoints';

export function useGetStaffAttendanceQuery(
  { date }: { date: string },
  options?: Partial<UseQueryOptions<StaffAttendanceDayData>>
) {
  return useQuery({
    ...options,
    queryKey: [GET_STAFF_ATTENDANCE, date],
    queryFn: async () =>
      makeAPICall<StaffAttendanceDayData>(
        GET_STAFF_ATTENDANCE,
        {},
        { date },
        {}
      ),
  });
}

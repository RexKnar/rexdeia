import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AttendanceReportData } from 'lib/domain/timetable';

import { makeAPICall } from '../../api';
import { GET_ATTENDANCE_REPORT } from '../../endpoints';

export function useGetAttendanceReportQuery(
  { sectionId, from, to }: { sectionId: string; from: string; to: string },
  options?: Partial<UseQueryOptions<AttendanceReportData>>
) {
  return useQuery({
    ...options,
    queryKey: [GET_ATTENDANCE_REPORT, sectionId, from, to],
    queryFn: async () =>
      makeAPICall<AttendanceReportData>(
        GET_ATTENDANCE_REPORT,
        {},
        { sectionId, from, to },
        {}
      ),
  });
}

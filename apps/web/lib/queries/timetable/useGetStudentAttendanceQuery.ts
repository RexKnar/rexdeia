import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  StudentAttendanceData,
  StudentAttendanceScope,
} from 'lib/domain/timetable';

import { makeAPICall } from '../../api';
import { GET_STUDENT_ATTENDANCE } from '../../endpoints';

export function useGetStudentAttendanceQuery(
  {
    sectionId,
    date,
    scope,
    slotId,
  }: {
    sectionId: string;
    date: string;
    scope: StudentAttendanceScope;
    slotId?: string;
  },
  options?: Partial<UseQueryOptions<StudentAttendanceData>>
) {
  return useQuery({
    ...options,
    queryKey: [GET_STUDENT_ATTENDANCE, sectionId, date, scope, slotId ?? ''],
    queryFn: async () => {
      const params: Record<string, string> = { sectionId, date, scope };
      if (slotId) params.slotId = slotId;
      return makeAPICall<StudentAttendanceData>(
        GET_STUDENT_ATTENDANCE,
        {},
        params,
        {}
      );
    },
  });
}

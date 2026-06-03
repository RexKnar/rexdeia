import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { StaffRosterData } from 'lib/domain/timetable';

import { makeAPICall } from '../../api';
import { GET_STAFF_ROSTER } from '../../endpoints';

export function useGetStaffRosterQuery(
  { staffId, date }: { staffId?: string; date?: string },
  options?: Partial<UseQueryOptions<StaffRosterData>>
) {
  return useQuery({
    ...options,
    queryKey: [GET_STAFF_ROSTER, staffId ?? 'me', date ?? 'today'],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (staffId) params.staffId = staffId;
      if (date) params.date = date;
      return makeAPICall<StaffRosterData>(GET_STAFF_ROSTER, {}, params, {});
    },
  });
}

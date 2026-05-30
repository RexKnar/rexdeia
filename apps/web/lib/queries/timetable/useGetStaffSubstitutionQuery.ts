import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { StaffSubstitutionData } from 'lib/domain/timetable';

import { makeAPICall } from '../../api';
import { GET_STAFF_SUBSTITUTION } from '../../endpoints';

export function useGetStaffSubstitutionQuery(
  { staffId, date }: { staffId: string; date: string },
  options?: Partial<UseQueryOptions<StaffSubstitutionData>>
) {
  return useQuery({
    ...options,
    queryKey: [GET_STAFF_SUBSTITUTION, staffId, date],
    queryFn: async () =>
      makeAPICall<StaffSubstitutionData>(
        GET_STAFF_SUBSTITUTION,
        {},
        { staffId, date },
        {}
      ),
  });
}

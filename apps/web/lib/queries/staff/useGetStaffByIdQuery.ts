import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { Staff } from '../../domain/staff';
import { GET_STAFF_BY_ID } from '../../endpoints';

function getStaffById(
  staffId: string,
  options?: Partial<UseQueryOptions<Staff>>
): UseQueryOptions<Staff> {
  return {
    ...options,
    queryKey: [GET_STAFF_BY_ID, staffId],
    queryFn: async () => {
      return await makeAPICall<Staff>(GET_STAFF_BY_ID, {}, {}, { id: staffId });
    },
  };
}
export function useGetStaffByIdQuery(
  staffId: string,
  options?: Partial<UseQueryOptions<Staff>>
): UseQueryResult<Staff> {
  return useQuery(getStaffById(staffId, options));
}

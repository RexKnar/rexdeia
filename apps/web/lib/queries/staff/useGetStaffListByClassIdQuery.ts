import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { Staff } from '../../domain/staff';
import { GET_STAFF_LIST_BY_CLASS_ID } from '../../endpoints';

function getStaffListByClassId(
  id: string,
  options?: Partial<UseQueryOptions<Staff[]>>
) {
  return {
    ...options,
    queryKey: [GET_STAFF_LIST_BY_CLASS_ID, id],
    queryFn: async () => {
      return await makeAPICall<Staff[]>(
        GET_STAFF_LIST_BY_CLASS_ID,
        {},
        {},
        { id }
      );
    },
  };
}

export function useGetStaffListByClassIdQuery(
  id: string,
  options?: Partial<UseQueryOptions<Staff[]>>
) {
  return useQuery(getStaffListByClassId(id, options));
}

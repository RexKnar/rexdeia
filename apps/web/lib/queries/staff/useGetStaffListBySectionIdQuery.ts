import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { Staff } from '../../domain/staff';
import { GET_STAFF_LIST_BY_SECTION_ID } from '../../endpoints';

function getStaffListBySectionId(id: string, options?: Partial) {
  return {
    ...options,
    queryKey: [GET_STAFF_LIST_BY_SECTION_ID, id],
    queryFn: async () => {
      return await makeAPICall<Staff[]>(
        GET_STAFF_LIST_BY_SECTION_ID,
        {},
        {},
        { id }
      );
    },
  };
}

export function useGetStaffListBySectionIdQuery(id: string, options?: Partial) {
  return useQuery(getStaffListBySectionId(id, options));
}

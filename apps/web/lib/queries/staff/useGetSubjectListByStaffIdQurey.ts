import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { GET_SUBJECT_LIST_BY_STAFF_ID } from 'lib/endpoints';

import { makeAPICall } from '../../api';
import { SubjectHandledByStaff } from '../../domain/staff';

function getSubjectByStaffId(
  staffId: string,
  options?: Partial
): UseQueryOptions {
  return {
    ...options,
    queryKey: [GET_SUBJECT_LIST_BY_STAFF_ID, staffId],
    queryFn: async () => {
      return await makeAPICall<SubjectHandledByStaff[]>(
        GET_SUBJECT_LIST_BY_STAFF_ID,
        {},
        {},
        { id: staffId }
      );
    },
  };
}
export function useGetSubjectByStaffIdQuery(
  staffId: string,
  options?: Partial
): UseQueryResult {
  return useQuery(getSubjectByStaffId(staffId, options));
}

import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { StaffSubjectList } from 'lib/domain/staff';

import { makeAPICall } from '../../api';
import { GET_STAFF_SUBJECT_LIST_BY_CLASS_ID } from '../../endpoints';

function getStaffSubjectListByClassId(
  classId: string,
  staffId: string,
  academicYearId: string,
  options?: Partial<UseQueryOptions<StaffSubjectList[]>>
): UseQueryOptions<StaffSubjectList[]> {
  return {
    ...options,
    queryKey: [GET_STAFF_SUBJECT_LIST_BY_CLASS_ID, classId],
    queryFn: async () => {
      return await makeAPICall<StaffSubjectList[]>(
        GET_STAFF_SUBJECT_LIST_BY_CLASS_ID,
        {},
        { academicYearId: academicYearId },
        { id: classId, staffId: staffId }
      );
    },
  };
}
export function useGetStaffSubjectListByClassIdQuery(
  classId: string,
  staffId: string,
  academicYearId: string,
  options?: Partial<UseQueryOptions<StaffSubjectList[]>>
): UseQueryResult<StaffSubjectList[]> {
  return useQuery(
    getStaffSubjectListByClassId(classId, staffId, academicYearId, options)
  );
}

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { SubjectModel } from 'lib/domain/subject';
import { GET_ANALYTICS_SUBJECTS_BY_STAFF } from 'lib/endpoints/subjectEndpoints';

function getAnalyticsSubjectListByStaffId(
  staffId: string,
  sectionId?: string,
  options?: Partial<UseQueryOptions<SubjectModel[]>>
) {
  return {
    ...options,
    queryKey: [GET_ANALYTICS_SUBJECTS_BY_STAFF, sectionId],
    queryFn: async () => {
      return await makeAPICall<SubjectModel[]>(
        GET_ANALYTICS_SUBJECTS_BY_STAFF,
        {},
        { sectionId: sectionId },
        { id: staffId }
      );
    },
  };
}

export function useGetAnalyticsSubjectsForStaffQuery(
  staffId: string,
  sectionId: string,
  options?: Partial<UseQueryOptions<SubjectModel[]>>
) {
  return useQuery(
    getAnalyticsSubjectListByStaffId(staffId, sectionId, options)
  );
}

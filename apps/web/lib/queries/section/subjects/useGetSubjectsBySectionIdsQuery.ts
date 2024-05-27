import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { GET_SUBJECTS_BY_SECTION_IDS } from 'lib/endpoints';

function getSectionByIdQuery(
  { sectionIds, classId },
  options?: Partial<UseQueryOptions<any>>
): UseQueryOptions<any> {
  return {
    ...options,
    queryKey: [GET_SUBJECTS_BY_SECTION_IDS, sectionIds],
    queryFn: async () => {
      return await makeAPICall<any>(
        GET_SUBJECTS_BY_SECTION_IDS,
        { sectionIds },
        {},
        { id: classId }
      );
    },
  };
}
export function useGetSubjectsBySectionIdsMutationQuery(
  sectionIds: string[],
  classId: string,
  options?: Partial<UseQueryOptions>
): UseQueryResult {
  return useQuery(getSectionByIdQuery({ sectionIds, classId }, options));
}

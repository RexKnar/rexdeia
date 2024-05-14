import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { SubjectModel } from '../../domain/subject';
import { GET_SUBJECT_LIST_BY_SECTION_ID } from '../../endpoints';

function getSubjectListBySectionId(
  sectionId: string,
  classId?: string,
  options?: Partial<UseQueryOptions<SubjectModel[]>>
) {
  return {
    ...options,
    queryKey: [GET_SUBJECT_LIST_BY_SECTION_ID, sectionId],
    queryFn: async () => {
      return await makeAPICall<SubjectModel[]>(
        GET_SUBJECT_LIST_BY_SECTION_ID,
        {},
        { classId: classId },
        { id: sectionId }
      );
    },
  };
}

export function useGetSubjectListBySectionIdQuery(
  sectionId: string,
  classId?: string,
  options?: Partial<UseQueryOptions<SubjectModel[]>>
) {
  return useQuery(getSubjectListBySectionId(sectionId, classId, options));
}

export function usePrefetchSubject() {
  const queryClient = useQueryClient();

  const prefetchSubjectListBySectionId = async (id: string) => {
    await queryClient.prefetchQuery(getSubjectListBySectionId(id));
  };

  return {
    prefetchSubjectListBySectionId,
  };
}

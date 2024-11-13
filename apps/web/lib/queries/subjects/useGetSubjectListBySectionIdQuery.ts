import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { GroupModel } from 'lib/domain/group';

import { makeAPICall } from '../../api';
import { GET_SUBJECT_LIST_BY_SECTION_ID } from '../../endpoints';

function getSubjectListBySectionId(
  sectionId: string,
  classId?: string,
  options?: Partial
) {
  return {
    ...options,
    queryKey: [GET_SUBJECT_LIST_BY_SECTION_ID, sectionId],
    queryFn: async () => {
      return await makeAPICall<GroupModel[]>(
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
  options?: Partial
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

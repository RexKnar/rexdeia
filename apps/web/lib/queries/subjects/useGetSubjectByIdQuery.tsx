import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { SubjectModel } from '../../domain/subject';
import { GET_SUBJECT_BY_ID } from '../../endpoints';

function getSubjectById(id: string, options?: Partial) {
  return {
    ...options,
    queryKey: [GET_SUBJECT_BY_ID, id],
    queryFn: async () => {
      return await makeAPICall<SubjectModel>(GET_SUBJECT_BY_ID, {}, {}, { id });
    },
  };
}

export function useGetSubjectByIdQuery(id: string, options?: Partial) {
  return useQuery(getSubjectById(id, options));
}

export function usePrefetchSubject() {
  const queryClient = useQueryClient();

  const prefetchSubjectById = async (id: string) => {
    await queryClient.prefetchQuery(getSubjectById(id));
  };

  return {
    prefetchSubjectById,
  };
}

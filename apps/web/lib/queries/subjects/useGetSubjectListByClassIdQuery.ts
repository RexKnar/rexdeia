import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { SubjectModel } from '../../domain/subject';
import { GET_SUBJECT_LIST_BY_CLASS_ID } from '../../endpoints';

function getSubjectListByClassId(id: string, options?: Partial) {
  return {
    ...options,
    queryKey: [GET_SUBJECT_LIST_BY_CLASS_ID, id],
    queryFn: async () => {
      return await makeAPICall<SubjectModel[]>(
        GET_SUBJECT_LIST_BY_CLASS_ID,
        {},
        {},
        { id }
      );
    },
  };
}

export function useGetSubjectListByClassIdQuery(id: string, options?: Partial) {
  return useQuery(getSubjectListByClassId(id, options));
}

import { useMutation } from '@tanstack/react-query';
import { PaginatedResponse } from 'lib/domain';
import { SubjectModel } from 'lib/domain/subject';
import { GET_SUBJECT_LIST_BY_FILTER } from 'lib/endpoints';

import { makeAPICall } from '../../api';

export function useGetSubjectListByFilter() {
  return useMutation({
    mutationFn: async (payload: any) => {
      return await makeAPICall<PaginatedResponse<SubjectModel>>(
        GET_SUBJECT_LIST_BY_FILTER,
        payload,
        {},
        {}
      );
    },
  });
}

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { GetStudentListModel } from '../../domain/student';
import { GET_STUDENTS_LIST_FOR_ASSIGN } from '../../endpoints';

type GetStudentListRequestPayload = {
  page: number;
  pageSize: number;
};

export function useGetStudentListForAssignQuery(
  payload: GetStudentListRequestPayload,
  options?: UseQueryOptions<GetStudentListModel>
) {
  return useQuery({
    ...options,
    queryKey: [GET_STUDENTS_LIST_FOR_ASSIGN, payload.page],
    queryFn: async () => {
      return await makeAPICall<GetStudentListModel>(
        GET_STUDENTS_LIST_FOR_ASSIGN,
        {},
        { ...payload },
        {}
      );
    },
  });
}

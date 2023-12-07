import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { makeAPICall } from '../api';
import { GetStudentListModel } from '../domain/student';
import { GET_STUDENTS_LIST } from '../endpoints';

type GetStudentListRequestPayload = {
  page: number;
  pageSize: number;
};

export function useGetStudentListQuery(
  payload: GetStudentListRequestPayload,
  options?: UseQueryOptions<GetStudentListModel>
) {
  return useQuery({
    ...options,
    queryKey: [GET_STUDENTS_LIST, payload.page],
    queryFn: async () => {
      return await makeAPICall<GetStudentListModel>(
        GET_STUDENTS_LIST,
        {},
        { ...payload },
        {}
      );
    },
  });
}

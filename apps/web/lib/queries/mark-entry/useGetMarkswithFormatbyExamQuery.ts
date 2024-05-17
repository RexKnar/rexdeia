import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { GET_MARKS_WITH_FORMAT_BY_EXAM } from '../../endpoints';

type GetMarksWithFormatByExamFilter = {
  examId: string;
  classId: string;
};

function getStudentsMarksByFilter(
  filter: GetMarksWithFormatByExamFilter,
  options?: Partial<UseQueryOptions<any[]>>
) {
  return {
    ...options,
    queryKey: [GET_MARKS_WITH_FORMAT_BY_EXAM],
    queryFn: async () => {
      return await makeAPICall<any[]>(
        GET_MARKS_WITH_FORMAT_BY_EXAM,
        { ...filter },
        {},
        {}
      );
    },
  };
}

export function useGetStudentsMarksByClassIdExamIdQuery(
  filter: GetMarksWithFormatByExamFilter,
  options?: Partial<UseQueryOptions<any[]>>
) {
  return useQuery(getStudentsMarksByFilter(filter, options));
}

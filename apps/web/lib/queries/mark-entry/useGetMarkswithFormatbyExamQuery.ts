import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { GET_MARKS_WITH_FORMAT_BY_EXAM } from '../../endpoints';

type GetMarksWithFormatByExamFilter = {
  examId: string;
};

function getMarksWithFormatByExam(
  filter: GetMarksWithFormatByExamFilter,
  options?: Partial<UseQueryOptions<any[]>>
) {
  return {
    ...options,
    queryKey: [GET_MARKS_WITH_FORMAT_BY_EXAM, filter.examId],
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

export function useGetMarksWithFormatByExamQuery(
  filter: GetMarksWithFormatByExamFilter,
  options?: Partial<UseQueryOptions<any[]>>
) {
  return useQuery(getMarksWithFormatByExam(filter, options));
}

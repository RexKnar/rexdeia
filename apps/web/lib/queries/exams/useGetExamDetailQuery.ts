import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ExamModel } from 'lib/domain/exam';

import { makeAPICall } from '../../api';
import { GET_EXAM_DETAIL_BY_EXAM_ID } from '../../endpoints';

function getExamDetail(
  { examId }: { examId: string },
  options?: Partial
): UseQueryOptions {
  return {
    ...options,
    queryKey: [GET_EXAM_DETAIL_BY_EXAM_ID, examId],
    queryFn: async () => {
      return await makeAPICall<ExamModel>(
        GET_EXAM_DETAIL_BY_EXAM_ID,
        {},
        {},
        { id: examId }
      );
    },
  };
}

export function useGetExamDetailQuery(
  { examId }: { examId: string },
  options?: Partial
) {
  return useQuery(getExamDetail({ examId }, options));
}

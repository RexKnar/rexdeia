import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { ExamTypeModel } from '../../domain/exam';
import { GET_EXAM_TYPE_BY_ID } from '../../endpoints';

function getExamTypeById(
  examTypeId: string,
  options?: Partial
): UseQueryOptions {
  return {
    ...options,
    queryKey: [GET_EXAM_TYPE_BY_ID, examTypeId],
    queryFn: async () => {
      return await makeAPICall<ExamTypeModel>(
        GET_EXAM_TYPE_BY_ID,
        {},
        {},
        { id: examTypeId }
      );
    },
  };
}
export function useGetExamTypeByIdQuery(
  id: string,
  options?: Partial
): UseQueryResult {
  return useQuery(getExamTypeById(id, options));
}

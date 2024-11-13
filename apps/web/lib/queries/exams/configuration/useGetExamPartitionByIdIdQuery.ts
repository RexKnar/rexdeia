import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { ExamSubjectPartitionModel } from 'lib/domain/exam';
import { GET_EXAM_CONFIG_BY_ID } from 'lib/endpoints';

function getExamPartitionById(
  payload: { id: string; configId: string },
  options?: Partial
): UseQueryOptions {
  return {
    ...options,
    queryKey: [GET_EXAM_CONFIG_BY_ID, payload],
    queryFn: async () => {
      return await makeAPICall<ExamSubjectPartitionModel>(
        GET_EXAM_CONFIG_BY_ID,
        {},
        {},
        payload
      );
    },
  };
}

export function useGetExamPartitionByIdIdQuery(
  payload: { id: string; configId: string },
  options?: Partial
): UseQueryResult {
  return useQuery(getExamPartitionById(payload, options));
}

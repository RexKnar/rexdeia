import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { GET_EXAM_CONFIG_BY_ID } from 'lib/endpoints';

function getExamPartitionById(
  configId: string,
  options?: Partial<UseQueryOptions>
) {
  return {
    ...options,
    queryKey: [GET_EXAM_CONFIG_BY_ID, configId],
    queryFn: async () => {
      return await makeAPICall(GET_EXAM_CONFIG_BY_ID, { configId }, {}, {});
    },
  };
}

export function useGetExamPartitionByIdIdQuery(
  configId: string,
  options?: Partial<UseQueryOptions>
) {
  return useQuery(getExamPartitionById(configId, options));
}

import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { TermModel } from 'lib/domain/exam';
import { GET_TERM_BY_ID } from 'lib/endpoints';

import { makeAPICall } from '../../api';

function getTermById(termId: string, options?: Partial): UseQueryOptions {
  return {
    ...options,
    queryKey: [GET_TERM_BY_ID, termId],
    queryFn: async () => {
      return await makeAPICall<TermModel>(
        GET_TERM_BY_ID,
        {},
        {},
        { id: termId }
      );
    },
  };
}
export function useGetTermByIdQuery(
  id: string,
  options?: Partial
): UseQueryResult {
  return useQuery(getTermById(id, options));
}

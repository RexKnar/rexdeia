import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { TermModel } from 'lib/domain/exam';
import { GET_TERM_BY_ID } from 'lib/endpoints';

function getTermById(
  termId: string,
  options?: Partial<UseQueryOptions<TermModel>>
): UseQueryOptions<TermModel> {
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
export function useGetMediumByIdQuery(
  id: string,
  options?: Partial<UseQueryOptions<TermModel>>
): UseQueryResult<TermModel> {
  return useQuery(getTermById(id, options));
}

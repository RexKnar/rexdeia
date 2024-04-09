import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { TermModel } from '../../domain/group';
import { GET_TERM_BY_ID } from '../../endpoints';

function getGroupById(
  groupId: string,
  options?: Partial<UseQueryOptions<TermModel>>
): UseQueryOptions<TermModel> {
  return {
    ...options,
    queryKey: [GET_TERM_BY_ID, groupId],
    queryFn: async () => {
      return await makeAPICall<TermModel>(
        GET_TERM_BY_ID,
        {},
        {},
        { id: groupId }
      );
    },
  };
}
export function useGetTermByIdQuery(
  id: string,
  options?: Partial<UseQueryOptions<TermModel>>
): UseQueryResult<TermModel> {
  return useQuery(getGroupById(id, options));
}

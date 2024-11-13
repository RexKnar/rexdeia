import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { GroupModel } from '../../domain/group';
import { GET_GROUP_BY_ID } from '../../endpoints';

function getGroupById(groupId: string, options?: Partial): UseQueryOptions {
  return {
    ...options,
    queryKey: [GET_GROUP_BY_ID, groupId],
    queryFn: async () => {
      return await makeAPICall<GroupModel>(
        GET_GROUP_BY_ID,
        {},
        {},
        { id: groupId }
      );
    },
  };
}
export function useGetGroupByIdQuery(
  id: string,
  options?: Partial
): UseQueryResult {
  return useQuery(getGroupById(id, options));
}

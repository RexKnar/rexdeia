import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { GET_BLOOD_GROUP_LIST } from '../../endpoints';

function getBloodGroupList(): UseQueryOptions {
  return {
    queryKey: [GET_BLOOD_GROUP_LIST],
    queryFn: async () => {
      return await makeAPICall(GET_BLOOD_GROUP_LIST, {}, {}, {});
    },
  };
}

export function useGetBloodGroupListQuery(): UseQueryResult {
  return useQuery(getBloodGroupList());
}

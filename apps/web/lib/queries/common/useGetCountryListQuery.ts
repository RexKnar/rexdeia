import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { GET_COUNTRY_LIST } from '../../endpoints';

function getCountryList(): UseQueryOptions {
  return {
    queryKey: [GET_COUNTRY_LIST],
    queryFn: async () => {
      return await makeAPICall(GET_COUNTRY_LIST, {}, {}, {});
    },
  };
}

export function useGetCountryListQuery(): UseQueryResult {
  return useQuery(getCountryList());
}

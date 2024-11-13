import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { GET_STATE_BY_COUNTRY_CODE } from '../../endpoints';

function getStateByCountryCode(
  countryCode: string,
  options?: Partial
): UseQueryOptions {
  return {
    ...options,
    queryKey: [GET_STATE_BY_COUNTRY_CODE, countryCode],
    queryFn: async () => {
      return await makeAPICall(
        GET_STATE_BY_COUNTRY_CODE,
        {},
        {},
        { countryCode: countryCode }
      );
    },
  };
}
export function useGetStateByCountryCodeQuery(
  countryCode: string,
  options?: Partial
): UseQueryResult {
  return useQuery(getStateByCountryCode(countryCode, options));
}

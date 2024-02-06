import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { GET_CITY_BY_STATE_CODE } from '../../endpoints';

function getCityByStateCode(
  countryCode: string,
  stateCode: string,
  options?: Partial<UseQueryOptions>
): UseQueryOptions {
  return {
    ...options,
    queryKey: [GET_CITY_BY_STATE_CODE, countryCode],
    queryFn: async () => {
      return await makeAPICall(
        GET_CITY_BY_STATE_CODE,
        {},
        {},
        { countryCode: countryCode, stateCode: stateCode }
      );
    },
  };
}
export function useGetCityByStateCodeQuery(
  countryCode: string,
  stateCode: string,
  options?: Partial<UseQueryOptions>
): UseQueryResult {
  return useQuery(getCityByStateCode(countryCode, stateCode, options));
}

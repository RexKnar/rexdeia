import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { makeAPICall } from '../api';
import { RegulationModel } from '../domain/regulation';
import { GET_REGULATION_LIST } from '../endpoints';

export function useGetRegulationListQuery(
  options?: UseQueryOptions<RegulationModel[]>
) {
  return useQuery({
    ...options,
    queryKey: [GET_REGULATION_LIST],
    queryFn: async () => {
      return await makeAPICall<RegulationModel[]>(
        GET_REGULATION_LIST,
        {},
        {},
        {}
      );
    },
  });
}

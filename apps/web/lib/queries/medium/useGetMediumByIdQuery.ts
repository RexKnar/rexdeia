import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { MediumModel } from '../../domain/medium';
import { GET_MEDIUM_BY_ID } from '../../endpoints';

function getMediumById(mediumId: string, options?: Partial): UseQueryOptions {
  return {
    ...options,
    queryKey: [GET_MEDIUM_BY_ID, mediumId],
    queryFn: async () => {
      return await makeAPICall<MediumModel>(
        GET_MEDIUM_BY_ID,
        {},
        {},
        { id: mediumId }
      );
    },
  };
}
export function useGetMediumByIdQuery(
  id: string,
  options?: Partial
): UseQueryResult {
  return useQuery(getMediumById(id, options));
}

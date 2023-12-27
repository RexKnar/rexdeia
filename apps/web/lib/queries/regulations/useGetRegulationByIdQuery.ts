import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { RegulationModel } from '../../domain/regulation';
import { GET_REGULATION_BY_ID } from '../../endpoints';

function getRegulationById(
  regulationId: string,
  options?: UseQueryOptions<RegulationModel>
): UseQueryOptions<RegulationModel> {
  return {
    ...options,
    queryKey: [GET_REGULATION_BY_ID, regulationId],
    queryFn: async () => {
      return await makeAPICall<RegulationModel>(
        GET_REGULATION_BY_ID,
        {},
        {},
        { id: regulationId }
      );
    },
  };
}
export function useGetRegulationByIdQuery(
  id: string,
  options?: UseQueryOptions<RegulationModel>
): UseQueryResult<RegulationModel> {
  return useQuery(getRegulationById(id, options));
}

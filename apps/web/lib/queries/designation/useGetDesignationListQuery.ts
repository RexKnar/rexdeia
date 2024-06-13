import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { DesignationModel } from 'lib/domain/designation';
import { GET_DESIGNATION_LIST } from 'lib/endpoints';

function getDesignationList(
  options?: Partial<UseQueryOptions<DesignationModel[]>>
) {
  return {
    ...options,
    queryKey: [GET_DESIGNATION_LIST],
    queryFn: async () => {
      return await makeAPICall<DesignationModel[]>(
        GET_DESIGNATION_LIST,
        {},
        {},
        {}
      );
    },
  };
}

export function useGetDesignationListQuery(
  options?: Partial<UseQueryOptions<DesignationModel[]>>
) {
  return useQuery(getDesignationList(options));
}

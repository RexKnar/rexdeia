import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { makeAPICall } from '../api';
import { ClassModel } from '../domain/class';
import { GET_CLASS } from '../endpoints';

export function useGetClassListQuery(options?: UseQueryOptions<ClassModel[]>) {
  return useQuery({
    ...options,
    queryKey: [GET_CLASS],
    queryFn: async () => {
      return await makeAPICall<ClassModel[]>(GET_CLASS, {}, {}, {});
    },
  });
}

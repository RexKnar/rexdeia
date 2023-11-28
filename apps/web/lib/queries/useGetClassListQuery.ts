import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { GET_CLASS } from '../endpoints';
import { makeAPICall } from '../api';
import { ClassModel } from '../domain/class';

export function useGetClassListQuery(options?: UseQueryOptions<ClassModel[]>) {
  return useQuery({
    ...options,
    queryKey: [GET_CLASS],
    queryFn: async () => {
      return await makeAPICall<ClassModel[]>(GET_CLASS, {}, {}, {});
    },
  });
}

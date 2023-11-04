import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { GET_USER_DETAILS } from '../endpoints';
import { makeAPICall } from '../api';
import { GetUserDetailsByIdModel } from '../domain/user';

export function useGetUserDetailsQuery(
  options?: UseQueryOptions<GetUserDetailsByIdModel>
) {
  return useQuery({
    ...options,
    queryKey: [GET_USER_DETAILS],
    queryFn: async () => {
      return await makeAPICall<GetUserDetailsByIdModel>(GET_USER_DETAILS);
    },
  });
}

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { CommunityModel } from 'lib/domain/community';
import { GET_ALL_COMMUNITY } from 'lib/endpoints';

function getCommunityList(
  options?: Partial<UseQueryOptions<CommunityModel[]>>
) {
  return {
    ...options,
    queryKey: [GET_ALL_COMMUNITY],
    queryFn: async () => {
      return await makeAPICall<CommunityModel[]>(GET_ALL_COMMUNITY, {}, {}, {});
    },
  };
}

export function useGetCommunityListQuery(
  options?: Partial<UseQueryOptions<CommunityModel[]>>
) {
  return useQuery(getCommunityList(options));
}

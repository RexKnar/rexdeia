import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import {
  CommunityModel,
  CreateCommunityRequestModel,
} from 'lib/domain/community';
import { ADD_COMMUNITY, GET_COMMUNITY_LIST } from 'lib/endpoints';

export function useCreateCommunityMutationQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (communityDetails: CreateCommunityRequestModel) => {
      const response = await makeAPICall<CommunityModel>(
        ADD_COMMUNITY,
        communityDetails,
        {},
        {}
      );
      await queryClient.invalidateQueries({
        queryKey: [GET_COMMUNITY_LIST],
      });

      return response;
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_COMMUNITY_LIST],
      });
    },
  });
}

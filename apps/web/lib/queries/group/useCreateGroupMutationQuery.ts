import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { CreateGroupModel, GroupModel } from '../../domain/group';
import { ADD_GROUP, GET_GROUP_LIST } from '../../endpoints';

export function useCreateGroupMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (shareDetails: CreateGroupModel) => {
      return await makeAPICall<GroupModel>(ADD_GROUP, shareDetails, {}, {});
    },
    onMutate: async (shareDetails: CreateGroupModel) => {
      await queryClient.cancelQueries({
        queryKey: [GET_GROUP_LIST, page, limit],
      });

      const previousGroup = queryClient.getQueryData<
        PaginatedResponse<GroupModel>
      >([GET_GROUP_LIST, page, limit, {}]);

      queryClient.setQueryData(
        [GET_GROUP_LIST, page, limit, {}],
        (existingGroup: PaginatedResponse<GroupModel>) => {
          return {
            ...existingGroup,
            data: [
              ...existingGroup.data,
              { ...shareDetails, isNewlyAdded: true },
            ],
          };
        }
      );

      return { previousGroup };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData([GET_GROUP_LIST], context.previousGroup);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_GROUP_LIST, page, limit],
      });
    },
  });
}

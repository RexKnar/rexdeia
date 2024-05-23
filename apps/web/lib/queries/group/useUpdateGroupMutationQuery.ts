import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { GroupModel, UpdateGroupModel } from '../../domain/group';
import { GET_GROUP_LIST, UPDATE_GROUP_BY_ID } from '../../endpoints';

export function useUpdateGroupMutationQuery(
  page: number,
  limit: number,
  filter = {}
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateGroupModel) => {
      return await makeAPICall<GroupModel>(
        UPDATE_GROUP_BY_ID,
        payload,
        {},
        { id: payload.id }
      );
    },
    onMutate: async (payload: UpdateGroupModel) => {
      await queryClient.cancelQueries({
        queryKey: [GET_GROUP_LIST, page, limit, filter],
      });

      const previousGroup = queryClient.getQueryData<
        PaginatedResponse<GroupModel>
      >([GET_GROUP_LIST, page, limit, filter]);

      queryClient.setQueryData(
        [GET_GROUP_LIST, page, limit, filter],
        (existingGroup: PaginatedResponse<GroupModel>) => {
          return {
            ...existingGroup,
            data: [
              ...existingGroup.data.map((group) => {
                if (group.id === payload.id) {
                  return { ...payload, isUpdating: true };
                }
                return group;
              }),
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

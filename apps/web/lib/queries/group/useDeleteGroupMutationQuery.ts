import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { GroupModel } from '../../domain/group';
import { DELETE_GROUP_BY_ID, GET_GROUP_LIST } from '../../endpoints';

export function useDeleteGroupMutationQuery(
  page: number,
  limit: number,
  filter = {}
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      return await makeAPICall<unknown>(DELETE_GROUP_BY_ID, {}, {}, { id });
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: [GET_GROUP_LIST, page, limit, filter],
      });

      const previousGroups = queryClient.getQueryData<PaginatedResponse>([
        GET_GROUP_LIST,
        page,
        limit,
        filter,
      ]);

      queryClient.setQueryData(
        [GET_GROUP_LIST, page, limit, filter],
        (currentPaginatedGroups: PaginatedResponse) => {
          return {
            ...currentPaginatedGroups,
            data: currentPaginatedGroups.data.map((group) => {
              if (group.id !== id) {
                return group;
              } else {
                return {
                  ...group,
                  isDeleting: true,
                };
              }
            }),
          };
        }
      );

      return { previousGroups: previousGroups };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(
        [GET_GROUP_LIST, page, limit],
        context.previousGroups
      );
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_GROUP_LIST, page, limit],
      });
    },
  });
}

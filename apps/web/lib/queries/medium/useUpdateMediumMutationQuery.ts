import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { PaginatedResponse } from '../../domain';
import { MediumModel, UpdateMediumModel } from '../../domain/medium';
import { GET_MEDIUM_LIST, UPDATE_MEDIUM_BY_ID } from '../../endpoints';

export function useUpdateMediumMutationQuery(page: number, limit: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateMediumModel) => {
      return await makeAPICall<MediumModel>(
        UPDATE_MEDIUM_BY_ID,
        payload,
        {},
        { id: payload.id }
      );
    },
    onMutate: async (payload: UpdateMediumModel) => {
      await queryClient.cancelQueries({
        queryKey: [GET_MEDIUM_LIST, page, limit],
      });

      const previousMedium = queryClient.getQueryData<
        PaginatedResponse<MediumModel>
      >([GET_MEDIUM_LIST, page, limit]);

      queryClient.setQueryData(
        [GET_MEDIUM_LIST, page, limit],
        (existingMedium: PaginatedResponse<MediumModel>) => {
          return {
            ...existingMedium,
            data: [
              ...existingMedium.data.map((medium) => {
                if (medium.id === payload.id) {
                  return { ...payload, isUpdating: true };
                }
                return medium;
              }),
            ],
          };
        }
      );

      return { previousMedium };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData([GET_MEDIUM_LIST], context.previousMedium);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_MEDIUM_LIST, page, limit],
      });
    },
  });
}

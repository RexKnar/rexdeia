import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateUserDetailsModel } from 'lib/domain/user';

import { makeAPICall } from '../../api';
import { GET_USER_DETAILS, UPDATE_USER_DETAILS } from '../../endpoints';

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateUserDetailsModel & { id: string }) => {
      const updatedUser = await makeAPICall<UpdateUserDetailsModel>(
        UPDATE_USER_DETAILS,
        payload,
        {},
        { id: payload.id }
      );

      await queryClient.invalidateQueries({
        queryKey: [GET_USER_DETAILS, payload.id],
      });
      return updatedUser;
    },
  });
}

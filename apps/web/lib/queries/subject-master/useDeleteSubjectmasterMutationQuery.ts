import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import {
  DELETE_SUBJECT_MASTER_BY_ID,
  GET_SUBJECT_MASTER_LIST,
} from '../../endpoints';

export function useDeleteSubjectMasterMutationQuery({
  page,
  limit,
  filter,
}: {
  page: number;
  limit: number;
  filter: {
    isActive?: boolean;
  };
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await makeAPICall<unknown>(
        DELETE_SUBJECT_MASTER_BY_ID,
        {},
        {},
        { id }
      );
      await queryClient.refetchQueries({
        queryKey: [GET_SUBJECT_MASTER_LIST, page, limit, filter],
      });

      return response;
    },
  });
}

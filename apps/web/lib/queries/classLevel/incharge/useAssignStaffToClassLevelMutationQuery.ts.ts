import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { ASSIGN_STAFF_CLASSLEVEL, GET_CLASSLEVELS_LIST } from 'lib/endpoints';

type AssignStaffToClassLevelPayload = {
  classLevelId: string;
  staffId: string;
};

export function useAssignStaffToClassLevelMutationQuery(
  page: number,
  limit: number
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AssignStaffToClassLevelPayload) => {
      const { classLevelId, ...body } = payload;

      const response = await makeAPICall(
        ASSIGN_STAFF_CLASSLEVEL,
        body,
        {},
        { id: classLevelId }
      );

      await queryClient.refetchQueries({
        queryKey: [GET_CLASSLEVELS_LIST, page, limit],
      });

      return response;
    },
  });
}

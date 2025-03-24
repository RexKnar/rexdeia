import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { MapStaffToClassModelEntity } from '../../domain/class';
import {
  ASSIGN_STAFF_BY_CLASS_ID,
  GET_STAFF_LIST_BY_CLASS_ID,
} from '../../endpoints';

export function useCreateStaffMutationByClassIdQuery(classId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: MapStaffToClassModelEntity) => {
      const response = await makeAPICall<MapStaffToClassModelEntity>(
        ASSIGN_STAFF_BY_CLASS_ID,
        payload,
        {},
        { id: classId }
      );

      await queryClient.invalidateQueries({
        queryKey: [GET_STAFF_LIST_BY_CLASS_ID, classId],
      });

      return response;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [GET_STAFF_LIST_BY_CLASS_ID, classId],
      });
    },
  });
}

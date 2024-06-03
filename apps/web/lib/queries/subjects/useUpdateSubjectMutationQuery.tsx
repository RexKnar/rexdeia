import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { SubjectModel, UpdateSubjectModel } from '../../domain/subject';
import {
  GET_SUBJECT_LIST_BY_CLASS_ID,
  UPDATE_SUBJECT_BY_ID,
} from '../../endpoints';

export function useUpdateSubjectMutationQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateSubjectModel) => {
      await makeAPICall<SubjectModel>(
        UPDATE_SUBJECT_BY_ID,
        payload,
        {},
        { id: payload.id }
      );
      await queryClient.invalidateQueries({
        queryKey: [GET_SUBJECT_LIST_BY_CLASS_ID],
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [GET_SUBJECT_LIST_BY_CLASS_ID],
      });
    },
  });
}

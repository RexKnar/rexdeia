import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { AddSubjectsToClassRequestModel } from '../../domain/class';
import { SubjectModel } from '../../domain/subject';
import {
  ADD_SUBJECT_BY_CLASS_ID,
  GET_SUBJECT_LIST_BY_CLASS_ID,
} from '../../endpoints';

export function useCreateSubjectMutationByClassIdQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      payload: AddSubjectsToClassRequestModel & { classId: string }
    ) => {
      await makeAPICall<SubjectModel>(
        ADD_SUBJECT_BY_CLASS_ID,
        payload,
        {},
        { id: payload.classId }
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

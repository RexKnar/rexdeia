import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { CreateSubjectModel, SubjectModel } from '../../domain/subject';
import { ADD_SUBJECT, GET_SUBJECT_LIST } from '../../endpoints';

export function useCreateSubjectMutationQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateSubjectModel) => {
      await makeAPICall<SubjectModel>(ADD_SUBJECT, payload, {}, {});
      await queryClient.invalidateQueries({
        queryKey: [GET_SUBJECT_LIST],
      });
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { CreateSubjectTypeModel, SubjectTypeModel } from '../../domain/subject';
import { ADD_SUBJECT_TYPE, GET_SUBJECT_TYPE_LIST } from '../../endpoints';

export function useCreateSubjectTypeMutationQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (subjectTypePayload: CreateSubjectTypeModel) => {
      const response = await makeAPICall<SubjectTypeModel>(
        ADD_SUBJECT_TYPE,
        subjectTypePayload,
        {},
        {}
      );
      await queryClient.refetchQueries({
        queryKey: [GET_SUBJECT_TYPE_LIST],
      });
      return response;
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_SUBJECT_TYPE_LIST],
      });
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import {
  CreateSubjectFormatModel,
  SubjectFormatModel,
} from '../../domain/subject';
import { ADD_SUBJECT_FORMAT, GET_SUBJECT_FORMAT_LIST } from '../../endpoints';

export function useCreateSubjectFormatMutationQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (subjectFormatPayload: CreateSubjectFormatModel) => {
      const response = await makeAPICall<SubjectFormatModel>(
        ADD_SUBJECT_FORMAT,
        subjectFormatPayload,
        {},
        {}
      );
      await queryClient.refetchQueries({
        queryKey: [GET_SUBJECT_FORMAT_LIST],
      });
      return response;
    },
  });
}

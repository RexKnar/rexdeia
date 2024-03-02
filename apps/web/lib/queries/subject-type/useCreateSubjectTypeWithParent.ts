import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateSubjectTypeModel, SubjectTypeModel } from 'lib/domain/subject';

import { makeAPICall } from '../../api';
import {
  ADD_SUBJECT_TYPE_WITH_PARENT_ID,
  GET_SUBJECT_TYPE_LIST,
} from '../../endpoints';

export function useCreateSubjectTypeWithParentMutationQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (subjectTypePayload: CreateSubjectTypeModel) => {
      const response = await makeAPICall<SubjectTypeModel>(
        ADD_SUBJECT_TYPE_WITH_PARENT_ID,
        subjectTypePayload,
        {},
        { id: subjectTypePayload.parentId }
      );
      await queryClient.refetchQueries({
        queryKey: [GET_SUBJECT_TYPE_LIST],
      });
      return response;
    },
  });
}

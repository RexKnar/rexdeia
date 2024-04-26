import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import {
  CreateSubjectMasterModel,
  SubjectMasterModel,
} from '../../domain/subject-master';
import { ADD_SUBJECT_MASTER, GET_SUBJECT_MASTER_LIST } from '../../endpoints';

export function useCreateSubjectMasterMutationQuery({
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
    mutationFn: async (payload: CreateSubjectMasterModel) => {
      const response = await makeAPICall<SubjectMasterModel>(
        ADD_SUBJECT_MASTER,
        payload,
        {},
        {}
      );
      return response;
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_SUBJECT_MASTER_LIST, page, limit, filter],
      });
    },
  });
}

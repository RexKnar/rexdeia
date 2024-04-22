import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  SubjectMasterModel,
  UpdateSubjectMasterModel,
} from 'lib/domain/subject-master';

import { makeAPICall } from '../../api';
import {
  GET_SUBJECT_MASTER_LIST,
  UPDATE_SUBJECT_MASTER_BY_ID,
} from '../../endpoints';

export function useUpdateSubjectMasterMutationQuery({
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
    mutationFn: async (payload: UpdateSubjectMasterModel) => {
      const response = await makeAPICall<SubjectMasterModel>(
        UPDATE_SUBJECT_MASTER_BY_ID,
        payload,
        {},
        { id: payload.id }
      );
      await queryClient.refetchQueries({
        queryKey: [GET_SUBJECT_MASTER_LIST, page, limit, filter],
      });
      return response;
    },
  });
}

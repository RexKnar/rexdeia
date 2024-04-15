import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateExamTypeModel } from 'lib/domain/exam';
import { ADD_EXAM_TYPE, GET_EXAM_TYPE_LIST } from 'lib/endpoints';

import { makeAPICall } from '../../api';

export function useCreateExamTypeMutationQuery({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateExamTypeModel) => {
      const response = await makeAPICall<CreateExamTypeModel>(
        ADD_EXAM_TYPE,
        payload,
        {},
        {}
      );
      await queryClient.invalidateQueries({
        queryKey: [GET_EXAM_TYPE_LIST, page, limit],
      });

      return response;
    },
    // onSuccess: async () => {
    //   await queryClient.refetchQueries({
    //     queryKey: [GET_EXAM_TYPE_LIST, page, limit],
    //   });
    // },
  });
}

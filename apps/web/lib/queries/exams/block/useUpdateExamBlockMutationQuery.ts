import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { ExamModel } from 'lib/domain/exam';
import { UPDATE_EXAM_BLOCK_STATUS } from 'lib/endpoints';

type ToggleExamBlockPayload = {
  examId: string;
  blockMarkEntry: boolean;
};

export function useToggleExamBlockMutationQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ examId, blockMarkEntry }: ToggleExamBlockPayload) => {
      return await makeAPICall<ExamModel>(
        UPDATE_EXAM_BLOCK_STATUS,
        { blockMarkEntry },
        {},
        { id: examId }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

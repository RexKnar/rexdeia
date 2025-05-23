import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { AssignLearnerModel } from 'lib/domain/learner';
import { GET_STUDENTS_LIST } from 'lib/endpoints';
import { ASSIGN_LEARNER } from 'lib/endpoints/institute/learnerEndpoints';

export function useAssignLearnerMutationQuery(page: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (studentDetails: AssignLearnerModel) => {
      const response = await makeAPICall<any>(
        ASSIGN_LEARNER,
        studentDetails,
        {},
        {}
      );
      await queryClient.invalidateQueries({
        queryKey: [GET_STUDENTS_LIST, page],
      });

      return response;
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_STUDENTS_LIST, page],
      });
    },
  });
}

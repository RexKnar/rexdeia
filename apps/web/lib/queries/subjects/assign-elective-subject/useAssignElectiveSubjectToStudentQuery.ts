import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { GET_SUBJECT_LIST_BY_CLASS_ID } from 'lib/endpoints';
import { ASSIGN_ELECTIVE_SUBJECTS } from 'lib/endpoints/subjectEndpoints';

export function useAssignElectiveSubjectToStudentQuery(subjectId) {
  const queryClient = useQueryClient();
  type AssignElectiveSubjectPayload = {
    subjectMasterId: string;
    studentIds: string[];
  };
  return useMutation({
    mutationFn: async (payload: AssignElectiveSubjectPayload) => {
      await makeAPICall(
        ASSIGN_ELECTIVE_SUBJECTS,
        payload,
        {},
        { id: subjectId }
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

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { GET_SECTION_BY_ID, UPDATE_ROLLNUMBERS } from '../../endpoints';

interface StudentFormData {
  students: Array<{
    studentId: string;
    id: string;
    firstName: string;
    lastName: string;
    rollNumber: string | number;
  }>;
}

export function useUpdateRollNumberMutationQuery(
  classId: string,
  sectionId: string
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: StudentFormData) => {
      const apiPayload: Record<string, unknown> = {
        students: payload.students.map((student) => ({
          studentId: student.studentId,
          id: student.id,
          rollNumber: student.rollNumber,
        })),
      };

      return await makeAPICall<any>(
        UPDATE_ROLLNUMBERS,
        apiPayload,
        {},
        { id: classId, sectionId: sectionId }
      );
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_SECTION_BY_ID, sectionId],
      });
    },
  });
}

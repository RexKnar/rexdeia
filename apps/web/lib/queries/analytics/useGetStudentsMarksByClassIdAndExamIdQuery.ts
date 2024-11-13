import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { StudentsMarksForAnalytics } from 'lib/domain/analytics';

import { makeAPICall } from '../../api';
import { GET_STUDENTS_MARKS_BY_CLASS_ID_AND_EXAM_ID } from '../../endpoints';

type GetStudentsMarksFilter = {
  classId: string;
  examId: string;
};

function getStudentsMarksByClassIdAndExamId(
  filter: GetStudentsMarksFilter,
  options?: Partial
) {
  return {
    ...options,
    queryKey: [
      GET_STUDENTS_MARKS_BY_CLASS_ID_AND_EXAM_ID,
      filter.classId,
      filter.examId,
    ],
    queryFn: async () => {
      return await makeAPICall<StudentsMarksForAnalytics[]>(
        GET_STUDENTS_MARKS_BY_CLASS_ID_AND_EXAM_ID,
        { ...filter },
        {},
        {}
      );
    },
  };
}

export function useGetStudentsMarksByClassIdAndExamIdQuery(
  filter: GetStudentsMarksFilter,
  options?: Partial
) {
  return useQuery(getStudentsMarksByClassIdAndExamId(filter, options));
}

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { ExamConfigSubjectModel } from 'lib/domain/examSubject';
import { GET_EXAM_SUBJECT_CONFIG_DETAIL_BY_ID } from 'lib/endpoints';

function getExamSubjectConfigDetailById(
  examSubjectId: string,
  options?: Partial<UseQueryOptions<ExamConfigSubjectModel>>
): UseQueryOptions<ExamConfigSubjectModel> {
  return {
    ...options,
    queryKey: [GET_EXAM_SUBJECT_CONFIG_DETAIL_BY_ID, examSubjectId],
    queryFn: async () => {
      return await makeAPICall<ExamConfigSubjectModel>(
        GET_EXAM_SUBJECT_CONFIG_DETAIL_BY_ID,
        {},
        {},
        { examSubjectId: examSubjectId }
      );
    },
  };
}

export function useGetExamSubjectConfigDetailByIdQuery(
  examSubjectId: string,
  options?: Partial<UseQueryOptions<ExamConfigSubjectModel>>
) {
  return useQuery(getExamSubjectConfigDetailById(examSubjectId, options));
}

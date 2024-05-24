import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { CommonGetModel } from 'lib/domain/common';
import { GET_EXAM_CONFIG_SUBJECT_DETAIL } from 'lib/endpoints';

type ExamConfigSubjectModel = {
  id: string;
  subject: CommonGetModel;
  examSubjectPartition: any;
};

type getSubjectInputModel = {
  examId: string;
  sectionId: string;
  subjectId: string;
};

function getExamConfigSubjectDetail(
  { examId, sectionId, subjectId }: getSubjectInputModel,
  options?: Partial<UseQueryOptions<ExamConfigSubjectModel>>
): UseQueryOptions<ExamConfigSubjectModel> {
  return {
    ...options,
    queryKey: [GET_EXAM_CONFIG_SUBJECT_DETAIL, examId, sectionId, subjectId],
    queryFn: async () => {
      return await makeAPICall<ExamConfigSubjectModel>(
        GET_EXAM_CONFIG_SUBJECT_DETAIL,
        {},
        { sectionId },
        { id: examId, subjectId: subjectId }
      );
    },
  };
}

export function useGetExamConfigSubjectDetailQuery(
  { examId, sectionId, subjectId }: getSubjectInputModel,
  options?: Partial<UseQueryOptions<ExamConfigSubjectModel>>
) {
  return useQuery(
    getExamConfigSubjectDetail({ examId, sectionId, subjectId }, options)
  );
}

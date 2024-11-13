import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { CommonGetModel } from 'lib/domain/common';
import { assessmentFormatConfiguration } from 'lib/domain/exam';
import { GET_SUBJECT_EXAM_CONFIG_DETAIL } from 'lib/endpoints';

type SubjectExamConfigModel = {
  id: string;
  subject: CommonGetModel;
  examConfiguration: assessmentFormatConfiguration[];
};

type getSubjectInputModel = {
  examId: string;
  sectionId: string;
  subjectId: string;
};

function getSubjectExamDetail(
  { examId, sectionId, subjectId }: getSubjectInputModel,
  options?: Partial
): UseQueryOptions {
  return {
    ...options,
    queryKey: [GET_SUBJECT_EXAM_CONFIG_DETAIL, examId, sectionId, subjectId],
    queryFn: async () => {
      return await makeAPICall<SubjectExamConfigModel>(
        GET_SUBJECT_EXAM_CONFIG_DETAIL,
        {},
        { sectionId },
        { id: examId, subjectId }
      );
    },
  };
}

export function useGetSubjectExamDetailQuery(
  { examId, sectionId, subjectId }: getSubjectInputModel,
  options?: Partial
) {
  return useQuery(
    getSubjectExamDetail({ examId, sectionId, subjectId }, options)
  );
}

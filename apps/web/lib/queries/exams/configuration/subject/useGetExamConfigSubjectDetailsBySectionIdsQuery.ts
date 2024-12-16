import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { CommonGetModel } from 'lib/domain/common';
import { Section } from 'lib/domain/staff';
import { GET_EXAM_CONFIG_SUBJECT_DETAIL_BY_SECTION_IDS } from 'lib/endpoints';

type ExamConfigSubjectModel = {
  subjectName: string;
  id: string;
  subject: CommonGetModel;
  section: Section;
  examSubjectPartition: any;
};

type getSubjectInputModel = {
  examId: string;
  sectionIds: string[];
  subjectId: string;
};

function getExamConfigSubjectDetailBySectionIds(
  { examId, sectionIds, subjectId }: getSubjectInputModel,
  options?: Partial<UseQueryOptions<ExamConfigSubjectModel[]>>
): UseQueryOptions<ExamConfigSubjectModel[]> {
  return {
    ...options,
    queryKey: [
      GET_EXAM_CONFIG_SUBJECT_DETAIL_BY_SECTION_IDS,
      examId,
      sectionIds,
      subjectId,
    ],
    queryFn: async () => {
      return await makeAPICall<ExamConfigSubjectModel[]>(
        GET_EXAM_CONFIG_SUBJECT_DETAIL_BY_SECTION_IDS,
        { sectionIds },
        {},
        { id: examId, subjectId: subjectId }
      );
    },
  };
}

export function useGetExamConfigSubjectDetailsBySectionIdsQuery(
  { examId, sectionIds, subjectId }: getSubjectInputModel,
  options?: Partial<UseQueryOptions<ExamConfigSubjectModel[]>>
) {
  return useQuery(
    getExamConfigSubjectDetailBySectionIds(
      { examId, sectionIds, subjectId },
      options
    )
  );
}

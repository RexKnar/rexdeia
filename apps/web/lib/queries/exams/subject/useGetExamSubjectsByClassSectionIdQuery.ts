import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { EXAM_SUBJECTS_BY_CLASS_SECTION_EXAM_ID } from 'lib/endpoints/examAnalyticsEndpoints';

// type SubjectExamConfigModel = {
//   id: string;
//   subject: CommonGetModel;
//   examConfiguration: assessmentFormatConfiguration[];
// };

type getSubjectInputModel = {
  examId: string;
  classId?: string;
  sectionId?: string;
};

function getExamSubjectsByClassSectionId(
  { examId, classId, sectionId }: getSubjectInputModel,
  options?: Partial<UseQueryOptions<any[]>>
): UseQueryOptions<any[]> {
  return {
    ...options,
    queryKey: [
      EXAM_SUBJECTS_BY_CLASS_SECTION_EXAM_ID,
      examId,
      classId,
      sectionId,
    ],
    queryFn: async () => {
      return await makeAPICall<any>(
        EXAM_SUBJECTS_BY_CLASS_SECTION_EXAM_ID,
        {},
        sectionId ? { sectionId, classId } : { classId },
        { id: examId }
      );
    },
  };
}

export function useGetExamSubjectsByClassSectionIdQuery(
  { examId, classId, sectionId }: getSubjectInputModel,
  options?: Partial<UseQueryOptions<any[]>>
) {
  return useQuery(
    getExamSubjectsByClassSectionId({ examId, classId, sectionId }, options)
  );
}

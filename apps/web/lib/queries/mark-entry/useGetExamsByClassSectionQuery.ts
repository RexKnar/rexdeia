import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { ExamModel } from '../../domain/exam';
import { GET_EXAM_BY_CLASS_SECTION } from '../../endpoints';

type GetExamsByClassSectionFilter = {
  classId: string;
  sectionId: string;
};

function getExamsByClassSection(
  filter: GetExamsByClassSectionFilter,
  options?: Partial<UseQueryOptions<ExamModel[]>>
) {
  return {
    ...options,
    queryKey: [GET_EXAM_BY_CLASS_SECTION, filter.sectionId],
    queryFn: async () => {
      return await makeAPICall<ExamModel[]>(
        GET_EXAM_BY_CLASS_SECTION,
        { ...filter },
        {},
        {}
      );
    },
  };
}

export function useGetExamsByClassSectionQuery(
  filter: GetExamsByClassSectionFilter,
  options?: Partial<UseQueryOptions<ExamModel[]>>
) {
  return useQuery(getExamsByClassSection(filter, options));
}

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { ExamModel } from '../../domain/exam';
import { GET_EXAM_BY_SECTION_ID } from '../../endpoints';

type GetExamPayloadModel = {
  classId?: string;
  sectionId?: string;
};

function getExamsBySectionId(filter: GetExamPayloadModel, options?: Partial) {
  return {
    ...options,
    queryKey: [GET_EXAM_BY_SECTION_ID, filter],
    queryFn: async () => {
      return await makeAPICall<ExamModel[]>(
        GET_EXAM_BY_SECTION_ID,
        { ...filter },
        {},
        {}
      );
    },
  };
}

export function useGetExamsBySectionIdQuery(
  filter: GetExamPayloadModel,
  options?: Partial
) {
  return useQuery(getExamsBySectionId(filter, options));
}

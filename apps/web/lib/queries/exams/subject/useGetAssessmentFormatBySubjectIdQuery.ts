import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../../api';
import { AssessmentFormatModel } from '../../../domain/subject';
import { GET_ASSESSMENT_FORMAT_BY_SUBJECT_ID } from '../../../endpoints';

function getAssessmentFormatBySubjectId(
  subjectId: string,
  options?: Partial
): UseQueryOptions {
  return {
    ...options,
    queryKey: [GET_ASSESSMENT_FORMAT_BY_SUBJECT_ID, subjectId],
    queryFn: async () => {
      return await makeAPICall<AssessmentFormatModel[]>(
        GET_ASSESSMENT_FORMAT_BY_SUBJECT_ID,
        {},
        {},
        { id: subjectId }
      );
    },
  };
}
export function useGetAssessmentFormatBySubjectIdQuery(
  id: string,
  options?: Partial
): UseQueryResult {
  return useQuery(getAssessmentFormatBySubjectId(id, options));
}

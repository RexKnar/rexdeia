import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { AssessmentFormatModel } from '../../domain/subject';
import { GET_ASSESSMENT_FORMAT_BY_ID } from '../../endpoints';

function getAssessmentFormatById(
  assessmentId: string,
  options?: Partial
): UseQueryOptions {
  return {
    ...options,
    queryKey: [GET_ASSESSMENT_FORMAT_BY_ID, assessmentId],
    queryFn: async () => {
      return await makeAPICall<AssessmentFormatModel>(
        GET_ASSESSMENT_FORMAT_BY_ID,
        {},
        {},
        { id: assessmentId }
      );
    },
  };
}
export function useGetAssessmentFormatByIdQuery(
  id: string,
  options?: Partial
): UseQueryResult {
  return useQuery(getAssessmentFormatById(id, options));
}

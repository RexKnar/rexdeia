import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { SubjectFormatModel } from '../../domain/subject';
import { GET_SUBJECT_FORMAT_BY_ID } from '../../endpoints';

function getSubjectFormatById(
  subjectFormatId: string,
  options?: Partial<UseQueryOptions<SubjectFormatModel>>
): UseQueryOptions<SubjectFormatModel> {
  return {
    ...options,
    queryKey: [GET_SUBJECT_FORMAT_BY_ID, subjectFormatId],
    queryFn: async () => {
      return await makeAPICall<SubjectFormatModel>(
        GET_SUBJECT_FORMAT_BY_ID,
        {},
        {},
        { id: subjectFormatId }
      );
    },
  };
}
export function useGetSubjectFormatByIdQuery(
  id: string,
  options?: Partial<UseQueryOptions<SubjectFormatModel>>
): UseQueryResult<SubjectFormatModel> {
  return useQuery(getSubjectFormatById(id, options));
}

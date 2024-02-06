import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { SubjectTypeModel } from '../../domain/subject';
import { GET_SUBJECT_TYPE_BY_ID } from '../../endpoints';

function getSubjectTypeById(
  subjectTypeId: string,
  options?: Partial<UseQueryOptions<SubjectTypeModel>>
): UseQueryOptions<SubjectTypeModel> {
  return {
    ...options,
    queryKey: [GET_SUBJECT_TYPE_BY_ID, subjectTypeId],
    queryFn: async () => {
      return await makeAPICall<SubjectTypeModel>(
        GET_SUBJECT_TYPE_BY_ID,
        {},
        {},
        { id: subjectTypeId }
      );
    },
  };
}
export function useGetSubjectTypeByIdQuery(
  id: string,
  options?: Partial<UseQueryOptions<SubjectTypeModel>>
): UseQueryResult<SubjectTypeModel> {
  return useQuery(getSubjectTypeById(id, options));
}

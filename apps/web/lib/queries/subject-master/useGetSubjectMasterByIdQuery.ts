import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { SubjectMasterModel } from '../../domain/subject-master';
import { GET_SUBJECT_MASTER_BY_ID } from '../../endpoints';

function getSubjectMasterById(
  subjectMasterId: string,
  options?: Partial<UseQueryOptions<SubjectMasterModel>>
): UseQueryOptions<SubjectMasterModel> {
  return {
    ...options,
    queryKey: [GET_SUBJECT_MASTER_BY_ID, subjectMasterId],
    queryFn: async () => {
      return await makeAPICall<SubjectMasterModel>(
        GET_SUBJECT_MASTER_BY_ID,
        {},
        {},
        { id: subjectMasterId }
      );
    },
  };
}
export function useGetSubjectMasterByIdQuery(
  id: string,
  options?: Partial<UseQueryOptions<SubjectMasterModel>>
): UseQueryResult<SubjectMasterModel> {
  return useQuery(getSubjectMasterById(id, options));
}

import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { SubjectToGroupModel } from 'lib/domain/subject';

import { makeAPICall } from '../../api';
import { GET_SUBJECTS_BY_CLASS_AND_GROUP_ID } from '../../endpoints';

function getSubjectList(
  id: string,
  classId: string,
  options?: UseQueryOptions<SubjectToGroupModel>
): UseQueryOptions<SubjectToGroupModel> {
  return {
    ...options,
    queryKey: [GET_SUBJECTS_BY_CLASS_AND_GROUP_ID, id, classId],
    queryFn: async () => {
      return await makeAPICall<SubjectToGroupModel>(
        GET_SUBJECTS_BY_CLASS_AND_GROUP_ID,
        {},
        { classId },
        { id }
      );
    },
  };
}

export function useGetSubjectToStudentByClassAndGroupId(
  id: string,
  classId: string,
  options?: UseQueryOptions<SubjectToGroupModel>
): UseQueryResult<SubjectToGroupModel> {
  return useQuery(getSubjectList(id, classId, options));
}

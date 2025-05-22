import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { InstituteCourseModuleModel } from 'lib/domain/institute/module';
import { GET_INSTITUTE_COURSE_MODULE_BY_ID } from 'lib/endpoints/institute/courseEndpoints';

function getModuleDetailById(
  moduleId: string,
  options?: Partial<UseQueryOptions<InstituteCourseModuleModel>>
) {
  return {
    ...options,
    queryKey: [GET_INSTITUTE_COURSE_MODULE_BY_ID],
    queryFn: async () => {
      return await makeAPICall<InstituteCourseModuleModel>(
        GET_INSTITUTE_COURSE_MODULE_BY_ID,
        {},
        {},
        { moduleId }
      );
    },
  };
}

export function useGetModuleDetailByIdQuery(
  moduleId: string,
  options?: Partial<UseQueryOptions<InstituteCourseModuleModel>>
): UseQueryResult<InstituteCourseModuleModel> {
  return useQuery(getModuleDetailById(moduleId, options));
}

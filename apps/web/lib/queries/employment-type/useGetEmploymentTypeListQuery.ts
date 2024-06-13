import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { EmploymentTypeModel } from 'lib/domain/employmentType';
import { GET_EMPLOYMENT_TYPE_LIST } from 'lib/endpoints';

function getEmploymentTypeList(
  options?: Partial<UseQueryOptions<EmploymentTypeModel[]>>
) {
  return {
    ...options,
    queryKey: [GET_EMPLOYMENT_TYPE_LIST],
    queryFn: async () => {
      return await makeAPICall<EmploymentTypeModel[]>(
        GET_EMPLOYMENT_TYPE_LIST,
        {},
        {},
        {}
      );
    },
  };
}

export function useGetEmploymentTypeListQuery(
  options?: Partial<UseQueryOptions<EmploymentTypeModel[]>>
) {
  return useQuery(getEmploymentTypeList(options));
}

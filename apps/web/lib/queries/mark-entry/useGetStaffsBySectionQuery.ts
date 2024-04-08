import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { Staff } from '../../domain/staff';
import { GET_STAFFS_BY_SECTION } from '../../endpoints';

type GetStaffsBySectionFilter = {
  sectionId: string;
};

function getStaffsBySection(
  filter: GetStaffsBySectionFilter,
  options?: UseQueryOptions<Staff>
): UseQueryOptions<Staff> {
  return {
    ...options,
    queryKey: [GET_STAFFS_BY_SECTION, filter.sectionId],
    queryFn: async () => {
      return await makeAPICall<Staff>(
        GET_STAFFS_BY_SECTION,
        { ...filter },
        {},
        {}
      );
    },
  };
}

export function useGetStaffsBySectionQuery(
  filter: GetStaffsBySectionFilter,
  options?: UseQueryOptions<Staff>
): UseQueryResult<Staff> {
  return useQuery(getStaffsBySection(filter, options));
}

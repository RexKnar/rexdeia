import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { StaffCategoryModel } from 'lib/domain/staffCategory';
import { GET_STAFF_CATEGORY_LIST } from 'lib/endpoints';

function getStaffCategoryList(options?: Partial) {
  return {
    ...options,
    queryKey: [GET_STAFF_CATEGORY_LIST],
    queryFn: async () => {
      return await makeAPICall<StaffCategoryModel[]>(
        GET_STAFF_CATEGORY_LIST,
        {},
        {},
        {}
      );
    },
  };
}

export function useGetStaffCategoryListQuery(options?: Partial) {
  return useQuery(getStaffCategoryList(options));
}

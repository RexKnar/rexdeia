import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import { GET_ADMISSIONS_LIST } from '../endpoints';
import { makeAPICall } from '../api';

export function useGetAdmissionsListQuery(
  page: number,
  pageSize: number,
  options?: UseInfiniteQueryOptions<any[]>
) {
  return useInfiniteQuery({
    ...options,
    queryKey: [GET_ADMISSIONS_LIST, page, pageSize],
    queryFn: async () => {
      return await makeAPICall<any[]>(
        GET_ADMISSIONS_LIST,
        {},
        { page: page.toString(), pageSize: pageSize.toString() }
      );
    },
  });
}

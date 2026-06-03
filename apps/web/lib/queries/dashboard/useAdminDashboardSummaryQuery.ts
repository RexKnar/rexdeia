import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { GET_ADMIN_DASHBOARD_SUMMARY } from '../../endpoints';
import { AdminDashboardSummary } from './types';

export function useAdminDashboardSummaryQuery(
  options?: Partial<UseQueryOptions<AdminDashboardSummary>>
) {
  return useQuery({
    ...options,
    queryKey: [GET_ADMIN_DASHBOARD_SUMMARY],
    queryFn: async () =>
      makeAPICall<AdminDashboardSummary>(
        GET_ADMIN_DASHBOARD_SUMMARY,
        {},
        {},
        {}
      ),
  });
}

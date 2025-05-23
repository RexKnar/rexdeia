import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { PaginatedResponse } from 'lib/domain';
import { InstituteCourseModel } from 'lib/domain/institute/course';
import { GET_PAYMENT_HISTORY_BY_LEARNER_ID } from 'lib/endpoints/institute/courseEndpoints';

function getPaymentHistoryByLearnersId(
  {
    page,
    limit,
    filter,
  }: {
    page: number;
    limit: number;
    filter: any;
  },
  options?: UseQueryOptions<PaginatedResponse<InstituteCourseModel>>
): UseQueryOptions<PaginatedResponse<InstituteCourseModel>> {
  return {
    ...options,
    queryKey: [GET_PAYMENT_HISTORY_BY_LEARNER_ID, page, limit],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse<InstituteCourseModel>>(
        GET_PAYMENT_HISTORY_BY_LEARNER_ID,
        { filter },
        {
          page: page,
          limit: limit,
        },
        {}
      );
    },
  };
}

export function usePaymentHistoryByLearnerIdQuery(
  {
    page,
    limit,
    filter,
  }: {
    page: number;
    limit: number;
    filter: any;
  },
  options?: UseQueryOptions<PaginatedResponse<InstituteCourseModel>>
): UseQueryResult<PaginatedResponse<InstituteCourseModel>> {
  return useQuery(
    getPaymentHistoryByLearnersId({ page, limit, filter }, options)
  );
}

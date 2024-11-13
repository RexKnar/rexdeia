import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { makeAPICall } from '../api';
import { ShareModal } from '../domain';
import { GET_ADMISSIONS_FORM_SHARE_DETAILS } from '../endpoints';

export function useGetAdmissionFormShareDetailsQuery(
  formId: string,
  options?: UseQueryOptions
) {
  return useQuery({
    ...options,
    queryKey: [GET_ADMISSIONS_FORM_SHARE_DETAILS, formId],
    queryFn: async () => {
      return await makeAPICall<ShareModal[]>(
        GET_ADMISSIONS_FORM_SHARE_DETAILS,
        {},
        {},
        { formId }
      );
    },
  });
}

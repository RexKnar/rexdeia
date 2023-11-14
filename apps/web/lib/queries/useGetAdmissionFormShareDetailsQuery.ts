import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { GET_ADMISSIONS_FORM_SHARE_DETAILS } from '../endpoints';
import { makeAPICall } from '../api';
import { ShareModal } from '../domain';

export function useGetAdmissionFormShareDetailsQuery(
  formId: string,
  options?: UseQueryOptions<ShareModal[]>
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

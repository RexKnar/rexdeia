import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { LanguageModel } from 'lib/domain/language';
import { GET_LANGUAGE_LIST } from 'lib/endpoints';

function getLanguageList(options?: Partial) {
  return {
    ...options,
    queryKey: [GET_LANGUAGE_LIST],
    queryFn: async () => {
      return await makeAPICall<LanguageModel[]>(GET_LANGUAGE_LIST, {}, {}, {});
    },
  };
}

export function useGetLanguageListQuery(options?: Partial) {
  return useQuery(getLanguageList(options));
}

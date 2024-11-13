import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { NatureOfPostingModel } from 'lib/domain/natureOfPosting';
import { GET_NATURE_OF_POSTING_LIST } from 'lib/endpoints';

function getNatureOfPostingList(options?: Partial) {
  return {
    ...options,
    queryKey: [GET_NATURE_OF_POSTING_LIST],
    queryFn: async () => {
      return await makeAPICall<NatureOfPostingModel[]>(
        GET_NATURE_OF_POSTING_LIST,
        {},
        {},
        {}
      );
    },
  };
}

export function useGetNatureOfPostingListQuery(options?: Partial) {
  return useQuery(getNatureOfPostingList(options));
}

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { GET_MARK_WITH_MARK_ENTRY_CONFIGS } from 'lib/endpoints';

type GetMarkEntryFormStructureFilter = {
  classId: string;
  examId: string;
  sectionId: string;
  staffId: string;
};

function getMarkWithMarkEntry(
  filter: GetMarkEntryFormStructureFilter,
  options?: Partial<UseQueryOptions<any[]>>
) {
  return {
    ...options,
    queryKey: [GET_MARK_WITH_MARK_ENTRY_CONFIGS, filter],
    queryFn: async () => {
      return await makeAPICall<any[]>(
        GET_MARK_WITH_MARK_ENTRY_CONFIGS,
        { ...filter },
        {},
        { id: filter.examId }
      );
    },
  };
}

export function useGetMarkWithMarkEntryQuery(
  filter: GetMarkEntryFormStructureFilter,
  options?: Partial<UseQueryOptions<any[]>>
) {
  return useQuery(getMarkWithMarkEntry(filter, options));
}

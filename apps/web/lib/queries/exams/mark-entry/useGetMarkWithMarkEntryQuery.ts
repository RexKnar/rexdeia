import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { makeAPICall } from 'lib/api';
import { GET_MARK_WITH_MARK_ENTRY_CONFIGS } from 'lib/endpoints';

type GetMarkEntryFormStructureFilter = {
  classId: string;
  examId: string;
  sectionId: string;
  staffId: string;
};

type MarKEntryResponse = {
  data: any[];
  permissions: {
    canEnterMarks: boolean;
    message?: string;
  };
};

function getMarkWithMarkEntry(
  filter: GetMarkEntryFormStructureFilter,
  options?: Partial<UseQueryOptions<MarKEntryResponse>>
) {
  return {
    ...options,
    queryKey: [GET_MARK_WITH_MARK_ENTRY_CONFIGS, filter],
    queryFn: async () => {
      return await makeAPICall<MarKEntryResponse>(
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
  options?: Partial<UseQueryOptions<MarKEntryResponse>>
) {
  return useQuery(getMarkWithMarkEntry(filter, options));
}

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { MarkEntryFromStructureModel } from 'lib/domain/mark-entry';

import { makeAPICall } from '../../api';
import { GET_MARK_ENTRY_FORM_STRUCTURE } from '../../endpoints';

type GetMarkEntryFormStructureFilter = {
  classId: string;
  examId: string;
  sectionId: string;
};

function getMarkEntryFormStructure(
  filter: GetMarkEntryFormStructureFilter,
  options?: Partial<UseQueryOptions<MarkEntryFromStructureModel[]>>
) {
  return {
    ...options,
    queryKey: [GET_MARK_ENTRY_FORM_STRUCTURE, filter],
    queryFn: async () => {
      return await makeAPICall<MarkEntryFromStructureModel[]>(
        GET_MARK_ENTRY_FORM_STRUCTURE,
        { ...filter },
        {},
        { id: filter.examId }
      );
    },
  };
}

export function useGetMarkEntryFormStructureQuery(
  filter: GetMarkEntryFormStructureFilter,
  options?: Partial<UseQueryOptions<MarkEntryFromStructureModel[]>>
) {
  return useQuery(getMarkEntryFormStructure(filter, options));
}

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { SectionModel } from '../../domain/section';
import { GET_ALL_SECTIONS_BY_CLASS_ID } from '../../endpoints';

function getAllSectionByClassId(
  id: string,
  options?: Partial<UseQueryOptions<SectionModel[]>>
) {
  return {
    ...options,
    queryKey: [GET_ALL_SECTIONS_BY_CLASS_ID, id],
    queryFn: async () => {
      return await makeAPICall<SectionModel[]>(
        GET_ALL_SECTIONS_BY_CLASS_ID,
        {},
        {},
        { id }
      );
    },
  };
}

export function useGetAllSectionByClassIdQuery(
  id: string,
  options?: Partial<UseQueryOptions<SectionModel[]>>
) {
  return useQuery(getAllSectionByClassId(id, options));
}

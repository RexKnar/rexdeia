import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { SectionModel } from '../../domain/section';
import { GET_ALL_SECTIONS_BY_CLASS_ID } from '../../endpoints';

function getAllSectionByClassId(
  { classId, filter }: { classId: string; filter: { isActive?: boolean } },
  options?: Partial<UseQueryOptions<SectionModel[]>>
) {
  return {
    ...options,
    queryKey: [GET_ALL_SECTIONS_BY_CLASS_ID, classId],
    queryFn: async () => {
      return await makeAPICall<SectionModel[]>(
        GET_ALL_SECTIONS_BY_CLASS_ID,
        filter,
        {},
        { classId }
      );
    },
  };
}

export function useGetAllSectionByClassIdQuery(
  { classId, filter }: { classId: string; filter: { isActive?: boolean } },
  options?: Partial<UseQueryOptions<SectionModel[]>>
) {
  return useQuery(getAllSectionByClassId({ classId, filter }, options));
}

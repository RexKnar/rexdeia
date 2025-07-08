import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { PaginatedResponse } from 'lib/domain';

import { makeAPICall } from '../../api';
import { SectionModel } from '../../domain/section';
import { GET_ALL_SECTIONS_BY_CLASS_ID } from '../../endpoints';

type SectionFilter = {
  isActive?: boolean;
  academicYearId?: string;
};

function getAllSectionByClassId(
  { classId, filter }: { classId: string; filter: SectionFilter },
  options?: Partial<UseQueryOptions<PaginatedResponse<SectionModel>>>
) {
  return {
    ...options,
    queryKey: [GET_ALL_SECTIONS_BY_CLASS_ID, classId, filter],
    queryFn: async () => {
      return await makeAPICall<PaginatedResponse<SectionModel>>(
        GET_ALL_SECTIONS_BY_CLASS_ID,
        filter,
        {},
        { id: classId }
      );
    },
  };
}

export function useGetAllSectionByClassIdQuery(
  { classId, filter }: { classId: string; filter: SectionFilter },
  options?: Partial<UseQueryOptions<PaginatedResponse<SectionModel>>>
) {
  return useQuery(getAllSectionByClassId({ classId, filter }, options));
}

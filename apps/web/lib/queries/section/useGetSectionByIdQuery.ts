import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { SectionModel } from '../../domain/section';
import { GET_SECTION_BY_ID } from '../../endpoints';

function getSectionByIdQuery(
  sectionId: string,
  options?: Partial
): UseQueryOptions {
  return {
    ...options,
    queryKey: [GET_SECTION_BY_ID, sectionId],
    queryFn: async () => {
      return await makeAPICall<SectionModel>(
        GET_SECTION_BY_ID,
        {},
        {},
        { id: sectionId }
      );
    },
  };
}
export function useGetSectionByIdQuery(
  sectionId: string,
  options?: Partial
): UseQueryResult {
  return useQuery(getSectionByIdQuery(sectionId, options));
}

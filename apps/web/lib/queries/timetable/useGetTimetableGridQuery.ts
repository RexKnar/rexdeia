import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { TimetableGridData } from 'lib/domain/timetable';

import { makeAPICall } from '../../api';
import { GET_TIMETABLE_GRID } from '../../endpoints';

export function useGetTimetableGridQuery(
  { sectionId }: { sectionId: string },
  options?: Partial<UseQueryOptions<TimetableGridData>>
) {
  return useQuery({
    ...options,
    queryKey: [GET_TIMETABLE_GRID, sectionId],
    queryFn: async () =>
      makeAPICall<TimetableGridData>(
        GET_TIMETABLE_GRID,
        {},
        { sectionId },
        {}
      ),
  });
}

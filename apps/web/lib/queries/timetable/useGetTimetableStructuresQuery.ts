import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { TimetableStructureModel } from 'lib/domain/timetable';

import { makeAPICall } from '../../api';
import { GET_TIMETABLE_STRUCTURES } from '../../endpoints';

export function useGetTimetableStructuresQuery(
  { classLevelId }: { classLevelId?: string },
  options?: Partial<UseQueryOptions<TimetableStructureModel[]>>
) {
  return useQuery({
    ...options,
    queryKey: [GET_TIMETABLE_STRUCTURES, classLevelId ?? 'all'],
    queryFn: async () =>
      makeAPICall<TimetableStructureModel[]>(
        GET_TIMETABLE_STRUCTURES,
        {},
        classLevelId ? { classLevelId } : {},
        {}
      ),
  });
}

import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { HolidayModel, SaveHolidayModel } from 'lib/domain/timetable';

import { makeAPICall } from '../../api';
import { DELETE_HOLIDAY, GET_HOLIDAYS, SAVE_HOLIDAY } from '../../endpoints';

export function useGetHolidaysQuery(
  { upcoming }: { upcoming?: boolean } = {},
  options?: Partial<UseQueryOptions<HolidayModel[]>>
) {
  return useQuery({
    ...options,
    queryKey: [GET_HOLIDAYS, upcoming ?? false],
    queryFn: async () =>
      makeAPICall<HolidayModel[]>(
        GET_HOLIDAYS,
        {},
        upcoming ? { upcoming: 'true' } : {},
        {}
      ),
  });
}

export function useSaveHolidayMutationQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SaveHolidayModel) => {
      const res = await makeAPICall(SAVE_HOLIDAY, payload, {}, {});
      await queryClient.invalidateQueries({ queryKey: [GET_HOLIDAYS] });
      return res;
    },
  });
}

export function useDeleteHolidayMutationQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await makeAPICall(DELETE_HOLIDAY, {}, {}, { id });
      await queryClient.invalidateQueries({ queryKey: [GET_HOLIDAYS] });
      return res;
    },
  });
}

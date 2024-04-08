import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
// import { SubjectModel } from '../../domain/subject';
import { GET_SUBJECTS_WITH_FORMATS_BY_EXAM } from '../../endpoints';

type SubjectsWithFormatsFilter = {
  classId: string;
  sectionId: string;
  examId: string;
};

function getSubjectsWithFormats(
  filter: SubjectsWithFormatsFilter,
  options?: Partial<UseQueryOptions<any[]>>
) {
  return {
    ...options,
    queryKey: [GET_SUBJECTS_WITH_FORMATS_BY_EXAM, filter.examId],
    queryFn: async () => {
      return await makeAPICall<any[]>(
        GET_SUBJECTS_WITH_FORMATS_BY_EXAM,
        { ...filter },
        {},
        {}
      );
    },
  };
}

export function useGetSubjectsWithFormatsQuery(
  filter: SubjectsWithFormatsFilter,
  options?: Partial<UseQueryOptions<any[]>>
) {
  return useQuery(getSubjectsWithFormats(filter, options));
}

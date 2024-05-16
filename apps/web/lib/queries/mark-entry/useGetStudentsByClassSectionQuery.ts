import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { makeAPICall } from '../../api';
import { Student } from '../../domain/student';
import { GET_STUDENTS_BY_CLASS_SECTION } from '../../endpoints';

type GetStudentsByClassSectionFilter = {
  classId: string;
  sectionId: string;
};

function getStudentsByClassSection(
  filter: GetStudentsByClassSectionFilter,
  options?: Partial<UseQueryOptions<Student[]>>
) {
  return {
    ...options,
    queryKey: [GET_STUDENTS_BY_CLASS_SECTION, filter.sectionId],
    queryFn: async () => {
      return await makeAPICall<Student[]>(
        GET_STUDENTS_BY_CLASS_SECTION,
        { ...filter },
        {},
        {}
      );
    },
  };
}

export function useGetStudentsByClassSectionQuery(
  filter: GetStudentsByClassSectionFilter,
  options?: Partial<UseQueryOptions<Student[]>>
) {
  return useQuery(getStudentsByClassSection(filter, options));
}

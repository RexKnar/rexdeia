'use client';

import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

import { useGetStudentListByClassIdQuery } from '../../../../../../lib/queries/students/useGetStudentListByClassIdQuery';
import { StudentCard } from '../section/[sectionId]/_components/StudentCard';

export function StudentList() {
  const params = useParams<{ classId: string }>();
  const { data: studentListResponse, isLoading: isStudentListLoading } =
    useGetStudentListByClassIdQuery(params.classId, {
      enabled: !!params.classId,
    });

  if (isStudentListLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-black" />
        <p className="text-black">Fetching Student List...</p>
      </div>
    );
  }

  if (!studentListResponse || studentListResponse.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-black">No Data Found</p>
      </div>
    );
  }

  return (
    <section className="grid w-full grid-cols-1 justify-between gap-4 px-0 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
      {studentListResponse.map((studentItem) => (
        <div key={studentItem.id}>
          <StudentCard id={studentItem.id} name={studentItem.firstName} />
        </div>
      ))}
    </section>
  );
}

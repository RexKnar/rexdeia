'use client';

import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

import { useGetStudentListBySectionIdQuery } from '../../../../../../../../lib/queries/students/useGetStudentListBySectionIdQuery';
import { StudentCard } from './StudentCard';

export function StudentList() {
  const params = useParams<{ sectionId: string }>();
  const { data: studentListResponse, isLoading: isStudentListLoading } =
    useGetStudentListBySectionIdQuery(params.sectionId, {
      enabled: !!params.sectionId,
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
    <section className="grid w-full grid-cols-4 justify-between gap-4 px-0">
      {studentListResponse.map((studentItem) => (
        <div key={studentItem.id} className="w-[272px]">
          <StudentCard id={studentItem.id} name={studentItem.firstName} />
        </div>
      ))}
    </section>
  );
}

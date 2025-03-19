/* eslint-disable prettier/prettier */
'use client';

import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

import { SubjectCard } from '../../../../../../lib/components/subjectcard/SubjectCard';
import { useGetSubjectListByClassIdQuery } from '../../../../../../lib/queries/subjects/useGetSubjectListByClassIdQuery';

export function SubjectList() {
  const params = useParams<{ classId: string }>();
  const { data: subjectListResponse, isLoading: isSubjectListLoading } =
    useGetSubjectListByClassIdQuery(params.classId, {
      enabled: !!params.classId,
    });

  if (isSubjectListLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="w-6 h-6 mr-2 text-black animate-spin" />
        <p className="text-black">Fetching Subject List...</p>
      </div>
    );
  }

  if (!subjectListResponse || subjectListResponse.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-black">No Data Found</p>
      </div>
    );
  }

  return (
    <section className="grid justify-between w-full grid-cols-4 gap-4 px-0">
      {subjectListResponse.map((subject) => (
        <div key={subject.id}>
          <SubjectCard
            id={subject.id}
            name={subject.name}
            staffNames={subject.academicSubjectForStaff
              .map((staff) => {
                const { firstName } = staff.staff;
                const sectionName = staff.section?.name;
                return `${firstName}(${sectionName})`;
              })
              .join(', ')}
          />
        </div>
      ))}
    </section>
  );
}

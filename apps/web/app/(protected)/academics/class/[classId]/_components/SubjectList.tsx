'use client';

import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

import { useGetSubjectListByClassIdQuery } from '../../../../../../lib/queries/subjects/useGetSubjectListByClassIdQuery';
import { SubjectCard } from '../section/[sectionId]/_components/SubjectCard';

export function SubjectList() {
  const params = useParams<{ classId: string }>();
  const { data: subjectListResponse, isLoading: isSubjectListLoading } =
    useGetSubjectListByClassIdQuery(params.classId, {
      enabled: !!params.classId,
    });

  if (isSubjectListLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-black" />
        <p className="text-black">Fetching Subject List...</p>
      </div>
    );
  }

  if (!subjectListResponse) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-black">No Data Found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4">
      {subjectListResponse.map((subjectItem) => (
        <div key={subjectItem.id} className="w-[275px]">
          <SubjectCard
            id={subjectItem.id}
            name={subjectItem.name}
            format=""
            type={subjectItem.SubjectType.name}
          />
        </div>
      ))}
    </div>
  );
}

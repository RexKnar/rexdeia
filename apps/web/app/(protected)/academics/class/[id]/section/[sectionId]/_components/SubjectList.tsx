'use client';

import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

import { useGetSubjectListBySectionIdQuery } from '../../../../../../../../lib/queries/subjects/useGetSubjectListBySectionIdQuery';
import { SubjectCard } from './SubjectCard';

export function SubjectList() {
  const params = useParams<{ sectionId: string }>();
  const { data: subjectListResponse, isLoading: isSubjectListLoading } =
    useGetSubjectListBySectionIdQuery(params.sectionId, {
      enabled: !!params.sectionId,
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
            format={subjectItem.SubjectFormat.name}
            type={subjectItem.SubjectType.name}
          />
        </div>
      ))}
    </div>
  );
}

'use client';

import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

import { useGetSubjectListBySectionIdQuery } from '../../../../../../../../lib/queries/subjects/useGetSubjectListBySectionIdQuery';
import { SubjectCard } from './SubjectCard';

export function SubjectList() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const { data: subjectListResponse, isLoading: isSubjectListLoading } =
    useGetSubjectListBySectionIdQuery(sectionId, {
      enabled: !!sectionId,
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
    <section className="w-full">
      {subjectListResponse.map((group) => (
        <div className="flex flex-col gap-4" key={group.id}>
          <p className="text-base font-bold">{group.group.name}</p>
          <div className="grid w-full grid-cols-4 justify-between gap-4 px-0">
            {group.group.subjectToGroup.map((subject) => (
              <div key={subject.subject.id} className="w-auto">
                <SubjectCard
                  id={subject.subject.id}
                  name={subject.subject.name}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

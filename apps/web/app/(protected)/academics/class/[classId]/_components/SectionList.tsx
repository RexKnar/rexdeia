/* eslint-disable prettier/prettier */
'use client';

import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

import { useGetAllSectionByClassIdQuery } from '../../../../../../lib/queries/section/useGetAllSectionsByClassIdQuery';
import { SectionCard } from '../section/[sectionId]/_components/SectionCard';

export function SectionList() {
  const { classId } = useParams<{ classId: string }>();
  const filter = {};
  const { data: sectionListResponse, isLoading: isSectionListLoading } =
    useGetAllSectionByClassIdQuery(
      { classId, filter },
      {
        enabled: !!classId,
      }
    );
  if (isSectionListLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="w-6 h-6 mr-2 text-black animate-spin" />
        <p className="text-black">Fetching Section List...</p>
      </div>
    );
  }
  if (!sectionListResponse) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-black">No Data Found</p>
      </div>
    );
  }

  return (
    <section className="grid justify-between w-full grid-cols-4 gap-4 px-0">
      {sectionListResponse?.data?.map((sectionItem) => (
        <div key={sectionItem.id}>
          <SectionCard
            id={sectionItem.id}
            name={sectionItem.name}
            classId={classId}
          />
        </div>
      ))}
    </section>
  );
}

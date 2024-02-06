'use client';

import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

import { useGetAllSectionByClassIdQuery } from '../../../../../../lib/queries/section/useGetAllSectionsByClassIdQuery';
import { SectionCard } from '../section/[sectionId]/_components/SectionCard';

export function SectionList() {
  const params = useParams<{ classId: string }>();
  const { data: sectionListResponse, isLoading: isSectionListLoading } =
    useGetAllSectionByClassIdQuery(params.classId, {
      enabled: !!params.classId,
    });
  if (isSectionListLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-black" />
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
    <div className="flex flex-wrap gap-4">
      {sectionListResponse.map((sectionItem) => (
        <div key={sectionItem.id} className="w-[275px]">
          <SectionCard
            id={sectionItem.id}
            name={sectionItem.name}
            classId={params.classId}
          />
        </div>
      ))}
    </div>
  );
}

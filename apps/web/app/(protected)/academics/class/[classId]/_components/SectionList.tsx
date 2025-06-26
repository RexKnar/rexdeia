'use client';

import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

import { useGetAllSectionByClassIdQuery } from '../../../../../../lib/queries/section/useGetAllSectionsByClassIdQuery';
import { UnassignInchargeFlyout } from '../_modals/UnassignInchargeFlyout';
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
    <section className="grid w-full grid-cols-1 gap-4 px-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {sectionListResponse?.data?.map((sectionItem) => (
        <SectionCard
          key={sectionItem.id}
          id={sectionItem.id}
          name={sectionItem.name}
          classId={classId}
          staffIncharges={sectionItem.staffIncharges}
        />
      ))}
      <UnassignInchargeFlyout />
    </section>
  );
}

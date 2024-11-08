'use client';

import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

import { useGetStaffListByClassIdQuery } from '../../../../../../lib/queries/staff/useGetStaffListByClassIdQuery';
import { StaffCard } from '../section/[sectionId]/_components/StaffCard';

export function StaffList() {
  const params = useParams<{ classId: string }>();
  const { data: staffListResponse, isLoading: isStaffListLoading } =
    useGetStaffListByClassIdQuery(params.classId, {
      enabled: !!params.classId,
    });

  if (isStaffListLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-black" />
        <p className="text-black">Fetching Staff List...</p>
      </div>
    );
  }

  if (!staffListResponse || staffListResponse.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-black">No Data Found</p>
      </div>
    );
  }

  return (
    <section className="grid w-full grid-cols-4 justify-between gap-4 px-0">
      {staffListResponse.map((staffItem) => (
        <div key={staffItem.id}>
          <StaffCard
            id={staffItem.id}
            name={`
              ${staffItem.firstName || ''}  ${staffItem.middleName || ''}  ${staffItem.lastName || ''}
            `}
            subjects={staffItem.subjects || []}
            sectionsHandled={staffItem.sections || []}
            sectionIncharge={staffItem.sectionIncharge || []}
          />
        </div>
      ))}
    </section>
  );
}
